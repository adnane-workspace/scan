-- CreateEnum
CREATE TYPE "CafeTrialRole" AS ENUM ('none', 'playground', 'template');

-- AlterEnum
ALTER TYPE "ActivityAction" ADD VALUE 'trial_started';
ALTER TYPE "ActivityAction" ADD VALUE 'trial_reset';

-- AlterTable
ALTER TABLE "Cafe" ADD COLUMN "trialRole" "CafeTrialRole" NOT NULL DEFAULT 'none';

-- CreateTable
CREATE TABLE "TrialLead" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "cafeName" VARCHAR(120) NOT NULL,
    "city" VARCHAR(80) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialLead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrialLead_createdAt_idx" ON "TrialLead"("createdAt");

CREATE INDEX "Cafe_trialRole_idx" ON "Cafe"("trialRole");
