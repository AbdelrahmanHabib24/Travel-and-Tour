"use client";

interface Props {
  token: string;
}

export default function PaymentIframe({ token }: Props) {

const iframeId = process.env.NEXT_PUBLIC_PAYMOB_IFRAME_ID;

  return (
     <div className="flex items-center overflow-hidden justify-center min-h-screen">
      <iframe
        src={`https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${token}`}
        width="100%"
        height="100%"
        className="border-0 w-full h-screen pt-10 overflow-hidden "
        title="Paymob Test Payment"
      />
    </div>
  );
}
