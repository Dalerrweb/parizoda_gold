/*
  Warnings:

  - You are about to alter the column `pricePerGram` on the `AuPrice` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "AuPrice" ALTER COLUMN "pricePerGram" SET DATA TYPE INTEGER;
