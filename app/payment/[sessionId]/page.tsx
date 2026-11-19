import PaymentPageClient from "./PaymentIframe";
import { prisma } from "@/lib/server/db/prisma";
import { getAuthenticatedUser } from "@/lib/server/auth/session";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function PaymentPage({ params }: Props) {
  const { sessionId } = await params;
  const t = await getTranslations("common.payment");
  const user = await getAuthenticatedUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-6">
        <p className="text-lg font-semibold text-gray-700">
          {t("sessionNotFound")}
        </p>
      </div>
    );
  }

  const session = await prisma.paymentSession.findUnique({
    where: { id: sessionId },
    select: {
      paymentToken: true,
      order: { select: { userId: true } },
    },
  });

  if (!session || session.order.userId !== user.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-6">
        <p className="text-lg font-semibold text-gray-700">
          {t("sessionNotFound")}
        </p>
      </div>
    );
  }

  return <PaymentPageClient token={session.paymentToken} />;
}
