-- CreateEnum
CREATE TYPE "MenuSectionKey" AS ENUM ('restaurant', 'cafe');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "sectionKey" "MenuSectionKey";

-- CreateIndex
CREATE UNIQUE INDEX "Category_cafeId_sectionKey_key" ON "Category"("cafeId", "sectionKey");
