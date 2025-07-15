-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERADMIN');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';
