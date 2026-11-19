import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import { getPaymobConfig } from "@/lib/server/config/env";
import {
  isSameOriginRequest,
  resolveAuthenticatedSession,
} from "@/lib/server/auth/session";
import {
  createPaymobCheckout,
  type PaymobBillingData,
} from "@/lib/server/services/paymob.service";
import {
  initiateAuthoritativePayment,
  type PaymentIdempotencyStore,
} from "@/lib/server/services/payment-orchestrator";
import { positiveIntIdSchema } from "@/lib/validations/package";

const prismaPaymentStore: PaymentIdempotencyStore = {
  async createPendingOrder(data) {
    return prisma.order.create({
      data: {
        packageId: data.packageId,
        userId: data.userId,
        amountCents: data.amountCents,
        currency: data.currency,
        idempotencyKey: data.idempotencyKey,
        status: "pending",
      },
      select: { id: true },
    });
  },

  async findOrderByIdempotencyKey(idempotencyKey) {
    return prisma.order.findUnique({
      where: { idempotencyKey },
      select: {
        id: true,
        userId: true,
        packageId: true,
        amountCents: true,
        status: true,
        sessions: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { id: true, paymentToken: true, amount: true },
        },
      },
    });
  },

  async completeOrderWithSession({
    orderId,
    paymobOrderId,
    paymentToken,
    amountCents,
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { paymobId: paymobOrderId },
      });

      await tx.payment.create({
        data: {
          orderId,
          paymentKey: paymentToken,
          status: "initialized",
        },
      });

      const session = await tx.paymentSession.create({
        data: {
          orderId,
          paymentToken,
          amount: amountCents,
        },
        select: { id: true, paymentToken: true, amount: true },
      });

      return {
        sessionId: session.id,
        paymentToken: session.paymentToken,
        amount: session.amount ?? amountCents,
      };
    });
  },

  async releaseFailedOrder(orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "failed", idempotencyKey: null },
    });
  },

  async markOrderUncertain(orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "uncertain" },
    });
  },
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSameOriginRequest(req)) {
      return NextResponse.json(
        { error: "Invalid request origin" },
        { status: 403 }
      );
    }

    const { user: authUser, applyCookies } = await resolveAuthenticatedSession();
    if (!authUser) {
      return applyCookies(
        NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        )
      );
    }

    const { id } = await params;
    const parsedId = positiveIntIdSchema.safeParse(id);
    if (!parsedId.success) {
      return NextResponse.json(
        { error: "Invalid package ID" },
        { status: 400 }
      );
    }

    const [pkg, dbUser] = await Promise.all([
      prisma.package.findUnique({
        where: { id: parsedId.data },
        select: { id: true, price: true, currency: true },
      }),
      prisma.user.findUnique({
        where: { id: authUser.id },
        select: { id: true, username: true, email: true },
      }),
    ]);

    if (!dbUser) {
      return NextResponse.json(
        { error: "Authenticated user not found" },
        { status: 401 }
      );
    }

    if (!pkg) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      billing_data?: Partial<PaymobBillingData>;
      idempotencyKey?: string;
    };
    const billing = body?.billing_data ?? {};

    const fullBillingData: PaymobBillingData = {
      first_name: billing.first_name || dbUser.username || "Customer",
      last_name: billing.last_name || "User",
      email: dbUser.email,
      street: billing.street || "N/A",
      building: billing.building || "N/A",
      floor: billing.floor || "N/A",
      apartment: billing.apartment || "N/A",
      city: billing.city || "Cairo",
      country: billing.country || "EGY",
      phone_number: billing.phone_number || "+201000000000",
    };

    const rawIdempotencyKey =
      req.headers.get("idempotency-key") || body?.idempotencyKey || null;
    const paymobConfig = getPaymobConfig();

    const outcome = await initiateAuthoritativePayment({
      userId: dbUser.id,
      packageId: pkg.id,
      packagePrice: pkg.price,
      packageCurrency: pkg.currency,
      usdToEgpRate: paymobConfig.usdToEgpRate,
      rawIdempotencyKey,
      billingData: fullBillingData,
      store: prismaPaymentStore,
      createPaymobSession: ({ amountCents, currency, billingData }) =>
        createPaymobCheckout({
          apiKey: paymobConfig.apiKey,
          integrationId: paymobConfig.integrationId,
          amountCents,
          currency,
          billingData,
        }),
    });

    if (!outcome.ok) {
      return applyCookies(
        NextResponse.json(
          { error: outcome.error },
          { status: outcome.statusCode }
        )
      );
    }

    return applyCookies(
      NextResponse.json({
        success: true,
        sessionId: outcome.sessionId,
        paymentToken: outcome.paymentToken,
        amount: outcome.amount,
        reused: outcome.reused,
      })
    );
  } catch (err) {
    console.error(
      "Payment API Route Error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
