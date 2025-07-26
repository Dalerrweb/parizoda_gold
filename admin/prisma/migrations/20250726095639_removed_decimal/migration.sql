/*
  Warnings:

  - You are about to alter the column `price` on the `BundleItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - You are about to alter the column `goldPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - You are about to alter the column `totalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "BundleItem" ALTER COLUMN "weight" SET DATA TYPE TEXT,
ALTER COLUMN "markup" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "goldPrice" SET DATA TYPE BIGINT,
ALTER COLUMN "totalAmount" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE BIGINT,
ALTER COLUMN "weight" SET DATA TYPE TEXT,
ALTER COLUMN "markup" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "markup" SET DEFAULT '0',
ALTER COLUMN "markup" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProductSize" ALTER COLUMN "weight" SET DATA TYPE TEXT;
