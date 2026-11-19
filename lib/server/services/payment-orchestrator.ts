import "server-only";
import {
  buildScopedIdempotencyKey,
  calculateAuthoritativeAmountCents,
  PaymobApiError,
  type PaymobBillingData,
  type PaymobCheckoutResult,
} from "@/lib/server/services/paymob.service";

export interface ExistingOrderWithSession {
  id: number;
  userId: number;
  packageId: number;
  amountCents: number;
  status: string;
  sessions: Array<{
    id: string;
    paymentToken: string;
    amount: number | null;
  }>;
}

export interface PaymentIdempotencyStore {
  createPendingOrder(data: {
    packageId: number;
    userId: number;
    amountCents: number;
    currency: string;
    idempotencyKey: string;
  }): Promise<{ id: number }>;
  findOrderByIdempotencyKey(
    idempotencyKey: string
  ): Promise<ExistingOrderWithSession | null>;
  completeOrderWithSession(params: {
    orderId: number;
    paymobOrderId: number;
    paymentToken: string;
    amountCents: number;
  }): Promise<{ sessionId: string; paymentToken: string; amount: number }>;
  releaseFailedOrder(orderId: number): Promise<void>;
  /**
   * Mark an order as uncertain WITHOUT releasing its idempotencyKey when an
   * external provider timeout/network error makes it unknown whether a remote
   * order was already created.
   */
  markOrderUncertain(orderId: number): Promise<void>;
}

export type InitiatePaymentOutcome =
  | {
      ok: true;
      reused: boolean;
      sessionId: string;
      paymentToken: string;
      amount: number;
    }
  | {
      ok: false;
      statusCode: number;
      error: string;
    };

function isUniqueConstraintError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: unknown }).code;
  return code === "P2002";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Concurrency-safe payment initiation:
 * 1. Computes authoritative amountCents from DB package price + currency rate.
 * 2. Claims unique `idempotencyKey` in PostgreSQL BEFORE calling external Paymob API.
 * 3. On concurrent unique-violation race (`P2002`), polls briefly for the winning
 *    request's PaymentSession and returns it — preventing duplicate Paymob orders.
 * 4. On Paymob failure/timeout, marks the claimed order as failed and releases the
 *    idempotency key so the user can retry cleanly.
 */
export async function initiateAuthoritativePayment(params: {
  userId: number;
  packageId: number;
  packagePrice: number;
  packageCurrency: string | null | undefined;
  usdToEgpRate: number;
  rawIdempotencyKey?: string | null;
  billingData: PaymobBillingData;
  store: PaymentIdempotencyStore;
  createPaymobSession: (args: {
    amountCents: number;
    currency: "EGP";
    billingData: PaymobBillingData;
  }) => Promise<PaymobCheckoutResult>;
  pollDelayMs?: number;
  maxPollAttempts?: number;
}): Promise<InitiatePaymentOutcome> {
  const {
    userId,
    packageId,
    packagePrice,
    packageCurrency,
    usdToEgpRate,
    rawIdempotencyKey,
    billingData,
    store,
    createPaymobSession,
    pollDelayMs = 150,
    maxPollAttempts = 10,
  } = params;

  const amountCents = calculateAuthoritativeAmountCents(
    packagePrice,
    packageCurrency,
    usdToEgpRate
  );
  const idempotencyKey = buildScopedIdempotencyKey(
    userId,
    packageId,
    rawIdempotencyKey
  );

  let claimedOrderId: number | null = null;
  try {
    const order = await store.createPendingOrder({
      packageId,
      userId,
      amountCents,
      currency: "EGP",
      idempotencyKey,
    });
    claimedOrderId = order.id;
  } catch (err) {
    if (!isUniqueConstraintError(err)) {
      throw err;
    }

    // Another concurrent or earlier request already claimed this idempotencyKey.
    for (let attempt = 0; attempt < maxPollAttempts; attempt++) {
      const existing = await store.findOrderByIdempotencyKey(idempotencyKey);
      if (!existing) {
        return {
          ok: false,
          statusCode: 409,
          error: "Previous payment attempt failed; please retry.",
        };
      }
      if (existing.userId !== userId || existing.packageId !== packageId) {
        return {
          ok: false,
          statusCode: 403,
          error: "Idempotency key does not belong to this booking",
        };
      }
      if (existing.sessions.length > 0) {
        const latest = existing.sessions[0];
        return {
          ok: true,
          reused: true,
          sessionId: latest.id,
          paymentToken: latest.paymentToken,
          amount: latest.amount ?? existing.amountCents,
        };
      }
      if (existing.status === "uncertain") {
        return {
          ok: false,
          statusCode: 504,
          error:
            "Previous payment request timed out with an uncertain provider outcome; do not retry with the same idempotency key.",
        };
      }
      if (existing.status === "failed") {
        return {
          ok: false,
          statusCode: 409,
          error: "Previous payment attempt failed; please retry.",
        };
      }
      if (attempt < maxPollAttempts - 1) {
        await sleep(pollDelayMs);
      }
    }

    return {
      ok: false,
      statusCode: 409,
      error: "Payment initialization already in progress; please retry shortly.",
    };
  }

  // We own the claimed Order — now call external Paymob API
  try {
    const paymob = await createPaymobSession({
      amountCents,
      currency: "EGP",
      billingData,
    });

    const completed = await store.completeOrderWithSession({
      orderId: claimedOrderId,
      paymobOrderId: paymob.paymobOrderId,
      paymentToken: paymob.paymentToken,
      amountCents,
    });

    return {
      ok: true,
      reused: false,
      sessionId: completed.sessionId,
      paymentToken: completed.paymentToken,
      amount: completed.amount,
    };
  } catch (err) {
    // Only release the idempotency claim when failure is deterministically known
    // to have happened BEFORE any remote Paymob order could be created.
    const isDeterministicNotCreated =
      err instanceof PaymobApiError && err.isAmbiguous === false;

    if (isDeterministicNotCreated) {
      await store.releaseFailedOrder(claimedOrderId).catch(() => {});
      return {
        ok: false,
        statusCode: 502,
        error: "Payment provider unavailable; please try again.",
      };
    }

    // Ambiguous failure/timeout: KEEP idempotencyKey locked to prevent duplicate Paymob orders
    await store.markOrderUncertain(claimedOrderId).catch(() => {});
    return {
      ok: false,
      statusCode: 504,
      error:
        "Payment provider timed out; order state is uncertain and idempotency key remains locked to prevent duplicate charges.",
    };
  }
}
