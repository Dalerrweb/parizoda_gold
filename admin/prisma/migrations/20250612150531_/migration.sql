/*
  Warnings:

  - You are about to drop the column `preciousMetal` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `ProductSize` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "preciousMetal",
DROP COLUMN "price",
DROP COLUMN "weight",
ADD COLUMN     "defaultWeight" DOUBLE PRECISION,
ADD COLUMN     "markup" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductSize" DROP COLUMN "value",
ADD COLUMN     "size" TEXT,
ADD COLUMN     "weight" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- DropEnum
DROP TYPE "MetalType";

-- CreateTable
CREATE TABLE "AuPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerGram" BIGINT NOT NULL,

    CONSTRAINT "AuPrice_pkey" PRIMARY KEY ("id")
);
