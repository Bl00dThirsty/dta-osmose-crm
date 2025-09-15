-- CreateTable
CREATE TABLE "salePromise" (
    "id" SERIAL NOT NULL,
    "dueDate" TIMESTAMP(3),
    "reminderDate" TIMESTAMP(3),
    "customerId" INTEGER,
    "userId" INTEGER,
    "customerCreatorId" INTEGER,
    "saleId" TEXT,
    "institutionId" TEXT NOT NULL,
    "customer_address" TEXT,
    "customer_name" TEXT,
    "customer_phone" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salePromise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salePromiseProduct" (
    "id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "promise_id" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_sale_price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salePromiseProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "salePromise" ADD CONSTRAINT "salePromise_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "saleInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePromise" ADD CONSTRAINT "CustomerSalePromiseRelation" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePromise" ADD CONSTRAINT "CustomerCreatorSalePromiseRelation" FOREIGN KEY ("customerCreatorId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePromise" ADD CONSTRAINT "salePromise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePromise" ADD CONSTRAINT "salePromise_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePromiseProduct" ADD CONSTRAINT "salePromiseProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salePromiseProduct" ADD CONSTRAINT "salePromiseProduct_promise_id_fkey" FOREIGN KEY ("promise_id") REFERENCES "salePromise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
