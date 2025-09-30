// app/api/packages/[id]/payment/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/ulits/prisma";

const USD_TO_EGP = 48;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = Number(id);

    const body = await req.json();
    const { amount, currency, billing_data } = body;
    const amountEGP = Math.round(
      amount * (currency === "USD" ? USD_TO_EGP : 1) * 100
    );

    // 🔹 Auth token
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });
    const authData = await authRes.json();
    const paymobAuthToken = authData.token;

    // 🔹 Order creation
    const orderRes = await fetch(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: paymobAuthToken,
          delivery_needed: false,
          amount_cents: amountEGP,
          currency: "EGP",
          items: [],
        }),
      }
    );
    const orderData = await orderRes.json();

    // 🔹 Payment key creation
    const fullBillingData = {
      first_name: billing_data?.first_name || "Test",
      last_name: billing_data?.last_name || "User",
      email: billing_data?.email || "test@example.com",
      street: billing_data?.street || "N/A",
      building: billing_data?.building || "N/A",
      floor: billing_data?.floor || "N/A",
      apartment: billing_data?.apartment || "N/A",
      city: billing_data?.city || "Cairo",
      country: billing_data?.country || "EGY",
      phone_number: billing_data?.phone_number || "+201234567890",
    };

    const paymentKeyRes = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: paymobAuthToken,
          amount_cents: amountEGP,
          expiration: 3600,
          order_id: orderData.id,
          currency: "EGP",
          integration_id: Number(process.env.PAYMOB_CASH_INTEGRATION_ID),
          billing_data: fullBillingData,
        }),
      }
    );

    const paymentKeyData = await paymentKeyRes.json();

    // 🔹 Save session in DB
    const session = await prisma.paymentSession.create({
      data: {
        paymentToken: paymentKeyData.token,
        orderId: packageId,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      paymentToken: session.paymentToken,
      amount: amountEGP,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
