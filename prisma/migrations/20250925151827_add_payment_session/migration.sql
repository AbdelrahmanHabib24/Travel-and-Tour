-- CreateTable
CREATE TABLE "public"."PaymentSession" (
    "id" TEXT NOT NULL,
    "paymentToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentSession_pkey" PRIMARY KEY ("id")
);
