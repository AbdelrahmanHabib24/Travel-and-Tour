import PaymentIframe from "./PaymentIframe";


interface Props {
  params:  Promise<{ sessionId: string }>;
}

export default async function PaymentPage({ params }: Props) {
  const { sessionId } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/${sessionId}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return <PaymentIframe token={data.paymentToken} />;
}
