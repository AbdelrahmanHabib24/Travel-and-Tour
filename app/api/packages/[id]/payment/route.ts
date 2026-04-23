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
    
    if (!authRes.ok) {
      const errorText = await authRes.text();
      console.error("Paymob Auth Error:", errorText);
      throw new Error("Paymob authentication failed");
    }

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

    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      console.error("Paymob Order Creation Error:", errorText);
      throw new Error("Paymob order creation failed");
    }

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

    if (!paymentKeyRes.ok) {
      const errorText = await paymentKeyRes.text();
      console.error("Paymob Payment Key Error:", errorText);
      throw new Error("Paymob payment key generation failed");
    }

    const paymentKeyData = await paymentKeyRes.json();

    // 🔹 1. Find or create a User for this order
    let dbUser = await prisma.user.findUnique({
      where: { email: fullBillingData.email }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: fullBillingData.email,
          username: fullBillingData.first_name,
          password: "placeholder_password", // In a real app, users should be pre-registered
        }
      });
    }

    // 🔹 2. Create a real Order in our DB
    const dbOrder = await prisma.order.create({
      data: {
        packageId: packageId,
        userId: dbUser.id,
        amountCents: amountEGP,
        currency: "EGP",
        status: "pending",
      }
    });

    // 🔹 3. Create the PaymentSession linked to the REAL Order ID
    const session = await prisma.paymentSession.create({
      data: {
        paymentToken: paymentKeyData.token,
        orderId: dbOrder.id,
        amount: amountEGP,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      paymentToken: session.paymentToken,
      amount: amountEGP,
    });
  } catch (err: any) {
    console.error("Payment API Route Error:", err.message || err);
    return NextResponse.json(
      { error: err.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}
