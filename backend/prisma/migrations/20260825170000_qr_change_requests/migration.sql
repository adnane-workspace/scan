-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'qr_generated';
ALTER TYPE "ActivityAction" ADD VALUE 'qr_change_requested';
ALTER TYPE "ActivityAction" ADD VALUE 'qr_change_approved';
ALTER TYPE "ActivityAction" ADD VALUE 'qr_change_rejected';

-- CreateEnum
CREATE TYPE "QrChangeRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN "qrGeneratedAt" TIMESTAMP(3),
ADD COLUMN "qrChangeAllowed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "QrChangeRequest" (
    "id" TEXT NOT NULL,
    "cafeId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "reason" VARCHAR(400) NOT NULL,
    "status" "QrChangeRequestStatus" NOT NULL DEFAULT 'pending',
    "reviewerId" TEXT,
    "reviewNote" VARCHAR(400) NOT NULL DEFAULT '',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QrChangeRequest_cafeId_status_idx" ON "QrChangeRequest"("cafeId", "status");

-- CreateIndex
CREATE INDEX "QrChangeRequest_status_createdAt_idx" ON "QrChangeRequest"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "QrChangeRequest_cafeId_pending_uidx" ON "QrChangeRequest"("cafeId") WHERE status = 'pending';

-- AddForeignKey
ALTER TABLE "QrChangeRequest" ADD CONSTRAINT "QrChangeRequest_cafeId_fkey" FOREIGN KEY ("cafeId") REFERENCES "Cafe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrChangeRequest" ADD CONSTRAINT "QrChangeRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrChangeRequest" ADD CONSTRAINT "QrChangeRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
