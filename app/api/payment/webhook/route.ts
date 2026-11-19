import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db/prisma";
import { getPaymobHmacSecret } from "@/lib/server/config/env";
import {
  processPaymobWebhook,
  type PaymobWebhookTransaction,
  type WebhookStore,
} from "@/lib/server/services/paymob.service";

const prismaWebhookStore: WebhookStore = {
  async findOrderByPaymobId(paymobId) {
    return prisma.order.findUnique({
      where: { paymobId },
      select: {
        id: true,
        paymobId: true,
        amountCents: true,
        currency: true,
        status: true,
      },
    });
  },

  async hasProcessedTransaction(paymobTransactionId) {
    const existing = await prisma.payment.findUnique({
      where: { paymobTransactionId },
      select: { id: true },
    });
    return existing !== null;
  },

  async recordTransactionAndUpdateOrder({
    orderId,
    paymobTransactionId,
    newOrderStatus,
    paymentStatus,
    paidAt,
  }) {
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          orderId,
          paymentKey: `webhook:${paymobTransactionId}`,
          paymobTransactionId,
          status: paymentStatus,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: newOrderStatus,
          ...(paidAt ? { paidAt } : {}),
        },
      });
    });
  },
};

export async function POST(req: NextRequest) {
  try {
    const hmacSecret = getPaymobHmacSecret();
    if (!hmacSecret) {
      return NextResponse.json(
        { error: "Paymob webhook verification is not configured" },
        { status: 503 }
      );
    }

    const receivedHmac =
      req.nextUrl.searchParams.get("hmac") || req.headers.get("x-paymob-hmac");
    const body = (await req.json().catch(() => null)) as {
      obj?: PaymobWebhookTransaction;
    } | null;

    if (!body || !body.obj || typeof body.obj !== "object") {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const result = await processPaymobWebhook({
      obj: body.obj,
      receivedHmac,
      hmacSecret,
      store: prismaWebhookStore,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      received: true,
      action: result.action,
      status: result.status,
    });
  } catch (err) {
    console.error(
      "Paymob webhook error:",
      err instanceof Error ? err.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
