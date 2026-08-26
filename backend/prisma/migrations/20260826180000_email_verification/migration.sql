-- CreateEnum
CREATE TYPE "VerificationPurpose" AS ENUM ('password_reset', 'email_verify');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

UPDATE "User" SET "emailVerifiedAt" = "createdAt" WHERE "emailVerifiedAt" IS NULL;

-- AlterTable
ALTER TABLE "PasswordReset" ADD COLUMN "purpose" "VerificationPurpose" NOT NULL DEFAULT 'password_reset';

-- CreateIndex
CREATE INDEX "PasswordReset_email_purpose_createdAt_idx" ON "PasswordReset"("email", "purpose", "createdAt");
