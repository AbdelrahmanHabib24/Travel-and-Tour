import "server-only";
import crypto from "node:crypto";

const PAYMOB_BASE_URL = "https://accept.paymob.com/api";
const PAYMOB_TIMEOUT_MS = 12_000;

export interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  city: string;
  country: string;
  phone_number: string;
}

export interface PaymobCheckoutResult {
  paymobOrderId: number;
  paymentToken: string;
}

/**
 * Compute authoritative EGP amount in piasters/cents strictly from DB package price.
 */
export function calculateAuthoritativeAmountCents(
  price: number,
  currency: string | null | undefined,
  usdToEgpRate: number
): number {
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Invalid package price");
  }
  if (!Number.isFinite(usdToEgpRate) || usdToEgpRate <= 0) {
    throw new Error("Invalid currency conversion rate");
  }

  const normalizedCurrency = (currency || "USD").trim().toUpperCase();
  const multiplier = normalizedCurrency === "USD" ? usdToEgpRate : 1;
  return Math.round(price * multiplier * 100);
}

/**
 * Scope idempotency key to authenticated user and package booking intent.
 */
export function buildScopedIdempotencyKey(
  userId: number,
  packageId: number,
  rawClientKey?: string | null
): string {
  const cleaned = rawClientKey?.trim();
  if (cleaned && /^[a-zA-Z0-9._:-]{8,128}$/.test(cleaned)) {
    return `u${userId}:p${packageId}:${cleaned}`;
  }
  // Fallback 5-minute booking intent bucket when client does not send Idempotency-Key
  const bucket = Math.floor(Date.now() / (5 * 60 * 1000));
  return `u${userId}:p${packageId}:b${bucket}`;
}

export class PaymobApiError extends Error {
  readonly isAmbiguous: boolean;
  readonly statusCode?: number;

  constructor(message: string, options: { isAmbiguous: boolean; statusCode?: number }) {
    super(message);
    this.name = "PaymobApiError";
    this.isAmbiguous = options.isAmbiguous;
    this.statusCode = options.statusCode;
  }
}

async function paymobPostJson<T>(
  path: string,
  payload: unknown,
  orderCreationStep: boolean
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${PAYMOB_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(PAYMOB_TIMEOUT_MS),
    });
  } catch {
    // Network errors or timeouts during/after order creation are ambiguous:
    // Paymob may have already created the remote order.
    throw new PaymobApiError(`Paymob network/timeout error on ${path}`, {
      isAmbiguous: orderCreationStep,
    });
  }

  if (!res.ok) {
    // 5xx responses on order/key steps are ambiguous; 4xx or auth failures are deterministic
    const isAmbiguous = orderCreationStep && res.status >= 500;
    throw new PaymobApiError(`Paymob API error (${res.status}) on ${path}`, {
      isAmbiguous,
      statusCode: res.status,
    });
  }

  return (await res.json()) as T;
}

export async function createPaymobCheckout(params: {
  apiKey: string;
  integrationId: number;
  amountCents: number;
  currency: "EGP";
  billingData: PaymobBillingData;
}): Promise<PaymobCheckoutResult> {
  const { apiKey, integrationId, amountCents, currency, billingData } = params;

  // Auth step occurs BEFORE any remote order exists -> deterministic failure
  const authData = await paymobPostJson<{ token?: string }>(
    "/auth/tokens",
    { api_key: apiKey },
    false
  );
  if (!authData.token) {
    throw new PaymobApiError("Paymob authentication returned no token", {
      isAmbiguous: false,
    });
  }

  // Order creation step -> timeouts/5xx are ambiguous
  const orderData = await paymobPostJson<{ id?: number }>(
    "/ecommerce/orders",
    {
      auth_token: authData.token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency,
      items: [],
    },
    true
  );
  if (typeof orderData.id !== "number") {
    throw new PaymobApiError("Paymob order creation returned no order ID", {
      isAmbiguous: true,
    });
  }

  // Payment key step -> remote order ALREADY exists, so any failure is ambiguous
  const keyData = await paymobPostJson<{ token?: string }>(
    "/acceptance/payment_keys",
    {
      auth_token: authData.token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderData.id,
      currency,
      integration_id: integrationId,
      billing_data: billingData,
    },
    true
  );
  if (!keyData.token) {
    throw new PaymobApiError("Paymob payment key generation returned no token", {
      isAmbiguous: true,
    });
  }

  return {
    paymobOrderId: orderData.id,
    paymentToken: keyData.token,
  };
}

export interface PaymobWebhookTransaction {
  id: number;
  amount_cents: number;
  created_at: string;
  currency: string;
  error_occured: boolean;
  has_parent_transaction: boolean;
  integration_id: number;
  is_3d_secure: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_refunded: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  order: { id: number };
  owner: number;
  pending: boolean;
  source_data: {
    pan: string;
    sub_type: string;
    type: string;
  };
  success: boolean;
}

/**
 * Compute Paymob's canonical HMAC-SHA512 digest over the 20 documented transaction fields
 * and compare using constant-time equality.
 */
export function computePaymobWebhookHmac(
  obj: PaymobWebhookTransaction,
  hmacSecret: string
): string {
  const concatenated = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success,
  ]
    .map((v) => (v === undefined || v === null ? "" : String(v)))
    .join("");

  return crypto
    .createHmac("sha512", hmacSecret)
    .update(concatenated)
    .digest("hex");
}

export function verifyPaymobWebhookHmac(
  obj: PaymobWebhookTransaction,
  receivedHmac: string | null | undefined,
  hmacSecret: string
): boolean {
  if (!receivedHmac || !hmacSecret) return false;
  const expected = computePaymobWebhookHmac(obj, hmacSecret);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(receivedHmac.trim().toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface WebhookOrderRecord {
  id: number;
  paymobId: number | null;
  amountCents: number;
  currency: string;
  status: string;
}

export interface WebhookStore {
  findOrderByPaymobId(paymobId: number): Promise<WebhookOrderRecord | null>;
  hasProcessedTransaction(paymobTransactionId: number): Promise<boolean>;
  recordTransactionAndUpdateOrder(params: {
    orderId: number;
    paymobTransactionId: number;
    newOrderStatus: OrderStatus;
    paymentStatus: string;
    paidAt: Date | null;
  }): Promise<void>;
}

export type WebhookProcessResult =
  | { ok: true; action: "updated" | "duplicate_ignored" | "out_of_order_ignored"; status?: OrderStatus }
  | { ok: false; statusCode: number; error: string };

/**
 * Process a Paymob webhook event with strict verification:
 * - Signature (HMAC-SHA512)
 * - Order existence, amount_cents, and currency match
 * - Duplicate transaction deduplication
 * - Out-of-order transition guard (never downgrade an already-paid order to pending/failed)
 */
export async function processPaymobWebhook(params: {
  obj: PaymobWebhookTransaction;
  receivedHmac: string | null | undefined;
  hmacSecret: string;
  store: WebhookStore;
  now?: Date;
}): Promise<WebhookProcessResult> {
  const { obj, receivedHmac, hmacSecret, store, now = new Date() } = params;

  if (!verifyPaymobWebhookHmac(obj, receivedHmac, hmacSecret)) {
    return { ok: false, statusCode: 401, error: "Invalid webhook signature" };
  }

  if (typeof obj.id !== "number" || typeof obj.order?.id !== "number") {
    return { ok: false, statusCode: 400, error: "Missing transaction or order identifier" };
  }

  if (await store.hasProcessedTransaction(obj.id)) {
    return { ok: true, action: "duplicate_ignored" };
  }

  const order = await store.findOrderByPaymobId(obj.order.id);
  if (!order) {
    return { ok: false, statusCode: 404, error: "Order not found" };
  }

  if (
    Number(obj.amount_cents) !== order.amountCents ||
    String(obj.currency || "").toUpperCase() !== order.currency.toUpperCase()
  ) {
    return {
      ok: false,
      statusCode: 400,
      error: "Webhook amount or currency mismatch",
    };
  }

  let nextStatus: OrderStatus;
  if (obj.is_refunded || obj.is_voided) {
    nextStatus = "refunded";
  } else if (obj.success && !obj.pending && !obj.error_occured) {
    nextStatus = "paid";
  } else if (obj.pending) {
    nextStatus = "pending";
  } else {
    nextStatus = "failed";
  }

  // Out-of-order guard: never downgrade a finalized paid/refunded order back to pending/failed
  if (
    (order.status === "paid" && (nextStatus === "pending" || nextStatus === "failed")) ||
    (order.status === "refunded" && nextStatus !== "refunded")
  ) {
    return { ok: true, action: "out_of_order_ignored", status: order.status as OrderStatus };
  }

  await store.recordTransactionAndUpdateOrder({
    orderId: order.id,
    paymobTransactionId: obj.id,
    newOrderStatus: nextStatus,
    paymentStatus: nextStatus,
    paidAt: nextStatus === "paid" ? now : null,
  });

  return { ok: true, action: "updated", status: nextStatus };
}
