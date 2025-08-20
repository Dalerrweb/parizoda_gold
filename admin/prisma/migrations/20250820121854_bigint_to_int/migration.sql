/*
  Warnings:

  - You are about to alter the column `goldPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `totalAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "goldPrice" SET DATA TYPE INTEGER,
ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;
