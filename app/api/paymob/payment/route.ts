// app/api/paymob/payment/route.ts
import { NextResponse } from "next/server";

const USD_TO_EGP = 48;

export async function POST(req: Request) {
  const body = await req.json();
  const { amount_cents, currency, billing_data } = body;

  try {
    // تحويل السعر لـ EGP لو كان USD
    const amountEGP =
      currency === "USD" ? Math.round((amount_cents / 100) * USD_TO_EGP * 100) : amount_cents;

    // 1️⃣ احصل على Auth Token
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });
    const authData = await authRes.json();
    const token = authData.token;

    // 2️⃣ إنشاء Order
    const orderRes = await fetch(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: token,
          delivery_needed: false,
          amount_cents: amountEGP,
          currency: "EGP",
          items: [],
        }),
      }
    );
    const orderData = await orderRes.json();

    // 3️⃣ إنشاء Payment Key (Sandbox – كل عمليات الدفع تعتبر ناجحة)
    const paymentKeyRes = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: amountEGP,
          expiration: 3600,
          order_id: orderData.id,
          currency: "EGP",
          integration_id: 5309050,
          billing_data: {
            ...billing_data,
            street: "Test Street",
            building: "10",
            floor: "2",
            apartment: "5",
          },
        }),
      }
    );
    const paymentKeyData = await paymentKeyRes.json();

    return NextResponse.json({ payment_token: paymentKeyData.token });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
