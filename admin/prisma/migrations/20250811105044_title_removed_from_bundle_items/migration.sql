/*
  Warnings:

  - You are about to drop the column `image` on the `BundleItem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `BundleItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BundleItem" DROP COLUMN "image",
DROP COLUMN "title",
ALTER COLUMN "variantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
