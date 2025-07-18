-- CreateEnum
CREATE TYPE "typCat" AS ENUM ('Pharmacie', 'Distributeur');

-- CreateTable
CREATE TABLE "Reporting" (
    "id" SERIAL NOT NULL,
    "prospectName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "degree" TEXT,
    "rdvObject" TEXT NOT NULL,
    "nextRdv" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "pharmacoVigilance" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reporting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "customId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "ville" TEXT,
    "nameresponsable" TEXT,
    "quarter" TEXT,
    "region" TEXT,
    "role" TEXT NOT NULL DEFAULT 'Particulier',
    "status" BOOLEAN DEFAULT true,
    "type_customer" TEXT DEFAULT 'Pharmacie',
    "website" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "institutionId" TEXT,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "EANCode" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "restockingThreshold" INTEGER NOT NULL,
    "sellingPriceTTC" DOUBLE PRECISION NOT NULL,
    "purchase_price" DOUBLE PRECISION NOT NULL,
    "warehouse" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "institutionId" TEXT NOT NULL,
    "imageName" TEXT,
    "idSupplier" INTEGER,
    "product_category_id" INTEGER,
    "unit_measurement" DOUBLE PRECISION,
    "unit_type" TEXT,
    "sku" TEXT,
    "reorder_quantity" INTEGER,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCounter" (
    "id" SERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saleInvoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "userId" INTEGER,
    "institutionId" TEXT NOT NULL,
    "customerCreatorId" INTEGER,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueAmount" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "delivred" BOOLEAN NOT NULL DEFAULT false,
    "ready" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "saleInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saleItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "saleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appSetting" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "tag_line" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "footer" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "appSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rolePermission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "street" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "gender" TEXT,
    "joinDate" TIMESTAMP(3),
    "birthday" TEXT,
    "employeeId" TEXT,
    "CnpsId" TEXT,
    "bloodGroup" TEXT,
    "departmentId" INTEGER,
    "designationId" INTEGER,
    "role" TEXT,
    "salary" DOUBLE PRECISION,
    "emergencyPhone1" TEXT,
    "emergencyname1" TEXT,
    "emergencylink1" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_claimTocustomer" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_claimTocustomer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_claimTouser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_claimTouser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "claimResponse_claimId_key" ON "claimResponse"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_customId_key" ON "customer"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_userName_key" ON "customer"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "customer_phone_key" ON "customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institution_slug_key" ON "institution"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_EANCode_key" ON "product"("EANCode");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCounter_institution_month_year_key" ON "ProductCounter"("institution", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "saleInvoice_invoiceNumber_key" ON "saleInvoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rolePermission_role_id_permission_id_key" ON "rolePermission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "user"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_employeeId_key" ON "user"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_CnpsId_key" ON "user"("CnpsId");

-- CreateIndex
CREATE INDEX "_claimTocustomer_B_index" ON "_claimTocustomer"("B");

-- CreateIndex
CREATE INDEX "_claimTouser_B_index" ON "_claimTouser"("B");

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

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "CustomerSaleInvoiceRelation" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "CustomerCreatorSaleInvoiceRelation" FOREIGN KEY ("customerCreatorId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "saleInvoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleInvoice" ADD CONSTRAINT "saleInvoice_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleItem" ADD CONSTRAINT "saleItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "saleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saleItem" ADD CONSTRAINT "saleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appSetting" ADD CONSTRAINT "appSetting_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_claimTocustomer" ADD CONSTRAINT "_claimTocustomer_A_fkey" FOREIGN KEY ("A") REFERENCES "claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_claimTocustomer" ADD CONSTRAINT "_claimTocustomer_B_fkey" FOREIGN KEY ("B") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_claimTouser" ADD CONSTRAINT "_claimTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_claimTouser" ADD CONSTRAINT "_claimTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
