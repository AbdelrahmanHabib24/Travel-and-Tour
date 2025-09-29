"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import PaymentIframe from "./PaymentIframe";

export default function PaymentPage() {
  const token = useSelector((state: RootState) => state.payment.token);

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-lg text-gray-500">
          Preparing your payment session...
        </p>
      </div>
    );
  }

  return <PaymentIframe token={token} />;
}
