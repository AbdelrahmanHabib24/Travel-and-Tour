// app/payment/[sessionId]/page.tsx
import PaymentPageClient from './PaymentIframe';
import { prisma } from '@/app/ulits/prisma';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function PaymentPage({ params }: Props) {
  const { sessionId } = await params;

  const session = await prisma.paymentSession.findUnique({
    where: { id: sessionId },
    select: { paymentToken: true },
  });

  if (!session) return <p>Payment session not found</p>;

  return <PaymentPageClient token={session.paymentToken} />;
}
