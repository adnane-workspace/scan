-- AlterTable
ALTER TABLE "Category" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "Category_cafeId_parentId_order_idx" ON "Category"("cafeId", "parentId", "order");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
