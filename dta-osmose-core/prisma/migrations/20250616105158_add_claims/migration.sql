-- CreateTable
CREATE TABLE "claim" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claimResponse" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claimResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit" (
    "id" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "usedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "claimResponse_claimId_key" ON "claimResponse"("claimId");

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "saleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claimResponse" ADD CONSTRAINT "claimResponse_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit" ADD CONSTRAINT "credit_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
