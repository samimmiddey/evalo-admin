-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INITIALIZED', 'BANK_APPROVAL_PENDING', 'ACTIVE', 'ON_HOLD', 'PAUSED', 'CANCELLED', 'COMPLETED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cashfreeSubId" TEXT NOT NULL,
    "cashfreePlanId" TEXT NOT NULL,
    "planSlug" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INITIALIZED',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "customerPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_cashfreeSubId_key" ON "Subscription"("cashfreeSubId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId", "status");

-- CreateIndex
CREATE INDEX "Subscription_cashfreeSubId_idx" ON "Subscription"("cashfreeSubId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
