"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import GlobalLoading from "../loading";

const PaymentPage: React.FC = () => {
  const [paymentToken, setPaymentToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tripPrice, setTripPrice] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const tripId = searchParams.get("id");

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId) {
        setError("Trip ID missing");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/packages/${tripId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch trip");
        const data = await res.json();
        setTripPrice(data.price);
      } catch (err) {
        console.error(err);
        setError("Failed to load trip details");
      }
    };

    fetchTrip();
  }, [tripId]);

  useEffect(() => {
    const initPayment = async () => {
      if (!tripPrice) return;

      try {
        setLoading(true);
        const res = await fetch("/api/paymob/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount_cents: Math.round(tripPrice * 100),
            currency: "USD",
            billing_data: {
              first_name: "Test",
              last_name: "User",
              email: "test@example.com",
              phone_number: "+201234567890",
              city: "Cairo",
              country: "EG",
            },
          }),
        });

        const data = await res.json();
        console.log("Paymob response:", data);
        if (data.payment_token) setPaymentToken(data.payment_token);
        else setError("Failed to get payment token. " + JSON.stringify(data));
      } catch (err) {
        console.error(err);
        setError("Payment initialization failed.");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [tripPrice]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <GlobalLoading />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <iframe
        src={`https://accept.paymob.com/api/acceptance/iframes/963685?payment_token=${paymentToken}`}
        width="100%"
        height="100%"
        className="border-0 h-screen"
        title="Paymob Test Payment"
      />
    </div>
  );
};

export default PaymentPage;
