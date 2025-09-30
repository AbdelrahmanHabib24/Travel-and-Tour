import PaymentIframe from "./PaymentIframe";


interface Props {
  params:  Promise<{ sessionId: string }>;
}

const baseUrl = process.env.BASE_URL;

export default async function PaymentPage({ params }: Props) {
  const { sessionId } = await params;

  const res = await fetch(
    `${baseUrl}/api/payment/${sessionId}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return <PaymentIframe token={data.paymentToken} />;
}
