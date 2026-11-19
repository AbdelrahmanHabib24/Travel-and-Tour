-- Phase 1: Security and Data Integrity (Strictly Additive — Preserves All Existing Data & Columns)

-- 1. Immutable Comment ownership (nullable FK; legacy rows remain userId = NULL)
ALTER TABLE "public"."Comment" ADD COLUMN "userId" INTEGER;
CREATE INDEX "Comment_packageId_idx" ON "public"."Comment"("packageId");
CREATE INDEX "Comment_userId_idx" ON "public"."Comment"("userId");
ALTER TABLE "public"."Comment"
  ADD CONSTRAINT "Comment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 2. RefreshToken model (hashed opaque tokens, rotation family, revocation)
CREATE TABLE "public"."RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "public"."RefreshToken"("tokenHash");
CREATE INDEX "RefreshToken_userId_idx" ON "public"."RefreshToken"("userId");
CREATE INDEX "RefreshToken_familyId_idx" ON "public"."RefreshToken"("familyId");
ALTER TABLE "public"."RefreshToken"
  ADD CONSTRAINT "RefreshToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. Payment idempotency & Paymob webhook deduplication
ALTER TABLE "public"."Order"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "paidAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "Order_paymobId_key" ON "public"."Order"("paymobId");
CREATE UNIQUE INDEX "Order_idempotencyKey_key" ON "public"."Order"("idempotencyKey");

ALTER TABLE "public"."Payment"
  ADD COLUMN "paymobTransactionId" INTEGER;
CREATE UNIQUE INDEX "Payment_paymobTransactionId_key" ON "public"."Payment"("paymobTransactionId");

ALTER TABLE "public"."Package" ALTER COLUMN "durationDays" SET DEFAULT 3;
