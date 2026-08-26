-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'trial_requested';
ALTER TYPE "ActivityAction" ADD VALUE 'trial_approved';
ALTER TYPE "ActivityAction" ADD VALUE 'trial_rejected';

-- CreateEnum
CREATE TYPE "TrialRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "TrialRequest" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(30) NOT NULL DEFAULT '',
    "cafeName" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "message" VARCHAR(400) NOT NULL DEFAULT '',
    "locale" VARCHAR(8) NOT NULL DEFAULT 'fr',
    "ip" VARCHAR(64) NOT NULL DEFAULT '',
    "status" "TrialRequestStatus" NOT NULL DEFAULT 'pending',
    "reviewerId" TEXT,
    "reviewNote" VARCHAR(400) NOT NULL DEFAULT '',
    "reviewedAt" TIMESTAMP(3),
    "cafeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrialRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrialRequest_email_status_idx" ON "TrialRequest"("email", "status");

-- CreateIndex
CREATE INDEX "TrialRequest_status_createdAt_idx" ON "TrialRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "TrialRequest_slug_idx" ON "TrialRequest"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrialRequest_email_pending_uidx" ON "TrialRequest"("email") WHERE status = 'pending';

-- AddForeignKey
ALTER TABLE "TrialRequest" ADD CONSTRAINT "TrialRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialRequest" ADD CONSTRAINT "TrialRequest_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
