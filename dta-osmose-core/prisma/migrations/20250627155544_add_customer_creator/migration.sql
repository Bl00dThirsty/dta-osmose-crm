-- DropForeignKey
ALTER TABLE "saleInvoice" DROP CONSTRAINT "saleInvoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "saleInvoice" DROP CONSTRAINT "saleInvoice_userId_fkey";

-- AlterTable
ALTER TABLE "saleInvoice" ADD COLUMN     "customerCreatorId" INTEGER,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "CustomerSaleInvoiceRelation" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "CustomerCreatorSaleInvoiceRelation" FOREIGN KEY ("customerCreatorId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "saleInvoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
