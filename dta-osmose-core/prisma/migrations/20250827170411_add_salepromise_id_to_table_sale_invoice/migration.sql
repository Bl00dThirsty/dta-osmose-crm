/*
  Warnings:

  - You are about to drop the column `saleId` on the `salePromise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "salePromise" DROP CONSTRAINT "salePromise_saleId_fkey";

-- AlterTable
ALTER TABLE "saleInvoice" ADD COLUMN     "salePromiseId" INTEGER;

-- AlterTable
ALTER TABLE "salePromise" DROP COLUMN "saleId";

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "saleInvoice_salePromiseId_fkey" FOREIGN KEY ("salePromiseId") REFERENCES "salePromise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
