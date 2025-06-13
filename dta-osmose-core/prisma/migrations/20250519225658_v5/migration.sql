/*
  Warnings:

  - The primary key for the `customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type_customer` column on the `customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CustomerCounter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customer" DROP CONSTRAINT "customer_pkey",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Particulier',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "nameresponsable" DROP DEFAULT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "email" DROP DEFAULT,
ALTER COLUMN "website" DROP DEFAULT,
DROP COLUMN "type_customer",
ADD COLUMN     "type_customer" TEXT NOT NULL DEFAULT 'Pharmacie',
ALTER COLUMN "quarter" DROP NOT NULL,
ALTER COLUMN "ville" DROP NOT NULL,
ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "CustomerCounter";

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
