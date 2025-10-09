"use client";

import { useState } from "react";
import GlobalLoading from "@/app/loading";

interface Props {
  token: string;
}

export default function PaymentIframe({ token }: Props) {
  const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;
  const iframeSrc = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${token}`;
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <GlobalLoading />
        </div>
      )}

      <iframe
        src={iframeSrc}
        title="Paymob Payment"
        className="w-full h-full border-0"
        allow="payment"
        loading="eager"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
