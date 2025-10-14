-- CreateEnum
CREATE TYPE "public"."typCat" AS ENUM ('Pharmacie', 'Distributeur');

-- CreateTable
CREATE TABLE "public"."Reporting" (
    "id" SERIAL NOT NULL,
    "prospectName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "degree" TEXT,
    "responsable" TEXT,
    "rdvObject" TEXT NOT NULL,
    "nextRdv" TIMESTAMP(3),
    "time" TEXT NOT NULL DEFAULT '00:00',
    "email" TEXT NOT NULL,
    "contact" TEXT,
    "address" TEXT NOT NULL,
    "pharmacoVigilance" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "filePath" TEXT,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reporting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."claim" (
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
CREATE TABLE "public"."claimResponse" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claimResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credit" (
    "id" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "usedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer" (
    "id" SERIAL NOT NULL,
    "customId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
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
CREATE TABLE "public"."department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."designation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product" (
    "id" TEXT NOT NULL,
    "EANCode" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "restockingThreshold" INTEGER NOT NULL,
    "sellingPriceTTC" DOUBLE PRECISION NOT NULL,
    "purchase_price" DOUBLE PRECISION NOT NULL,
    "sellingPriceCFA" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchasePriceCFA" DOUBLE PRECISION NOT NULL DEFAULT 0,
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
CREATE TABLE "public"."ProductCounter" (
    "id" SERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saleInvoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "userId" INTEGER,
    "institutionId" TEXT NOT NULL,
    "salePromiseId" INTEGER,
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
    "date" TIMESTAMP(3),

    CONSTRAINT "saleInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saleItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "saleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salePromise" (
    "id" SERIAL NOT NULL,
    "dueDate" TIMESTAMP(3),
    "reminderDate" TIMESTAMP(3),
    "customerId" INTEGER,
    "userId" INTEGER,
    "customerCreatorId" INTEGER,
    "institutionId" TEXT NOT NULL,
    "customer_address" TEXT,
    "customer_name" TEXT,
    "customer_phone" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "restocked" BOOLEAN NOT NULL DEFAULT false,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salePromise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salePromiseProduct" (
    "id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "promise_id" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_sale_price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "salePromiseProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    "customerId" INTEGER,
    "saleId" TEXT,
    "institutionId" TEXT,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "titre" TEXT NOT NULL DEFAULT 'Inventaire XX',
    "location" TEXT,
    "institutionId" TEXT NOT NULL,
    "performedById" INTEGER NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inventoryItem" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "countedQty" INTEGER NOT NULL DEFAULT 0,
    "systemQty" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "inventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Promotion" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "discount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."appSetting" (
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
CREATE TABLE "public"."role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rolePermission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
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
CREATE TABLE "public"."_claimTocustomer" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_claimTocustomer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_claimTouser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_claimTouser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "claimResponse_claimId_key" ON "public"."claimResponse"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_customId_key" ON "public"."customer"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_userName_key" ON "public"."customer"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "customer_phone_key" ON "public"."customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "public"."customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "institution_slug_key" ON "public"."institution"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_EANCode_key" ON "public"."product"("EANCode");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "public"."product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCounter_institution_month_year_key" ON "public"."ProductCounter"("institution", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "saleInvoice_invoiceNumber_key" ON "public"."saleInvoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "public"."role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "public"."permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rolePermission_role_id_permission_id_key" ON "public"."rolePermission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "public"."user"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "public"."user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_employeeId_key" ON "public"."user"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_CnpsId_key" ON "public"."user"("CnpsId");

-- CreateIndex
CREATE INDEX "_claimTocustomer_B_index" ON "public"."_claimTocustomer"("B");

-- CreateIndex
CREATE INDEX "_claimTouser_B_index" ON "public"."_claimTouser"("B");

-- AddForeignKey
ALTER TABLE "public"."Reporting" ADD CONSTRAINT "Reporting_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reporting" ADD CONSTRAINT "Reporting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim" ADD CONSTRAINT "claim_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim" ADD CONSTRAINT "claim_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."saleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claim" ADD CONSTRAINT "claim_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."claimResponse" ADD CONSTRAINT "claimResponse_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "public"."claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."credit" ADD CONSTRAINT "credit_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer" ADD CONSTRAINT "customer_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer" ADD CONSTRAINT "customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleInvoice" ADD CONSTRAINT "CustomerSaleInvoiceRelation" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleInvoice" ADD CONSTRAINT "CustomerCreatorSaleInvoiceRelation" FOREIGN KEY ("customerCreatorId") REFERENCES "public"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleInvoice" ADD CONSTRAINT "saleInvoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleInvoice" ADD CONSTRAINT "saleInvoice_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleInvoice" ADD CONSTRAINT "saleInvoice_salePromiseId_fkey" FOREIGN KEY ("salePromiseId") REFERENCES "public"."salePromise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleItem" ADD CONSTRAINT "saleItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."saleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saleItem" ADD CONSTRAINT "saleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salePromise" ADD CONSTRAINT "CustomerSalePromiseRelation" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salePromise" ADD CONSTRAINT "CustomerCreatorSalePromiseRelation" FOREIGN KEY ("customerCreatorId") REFERENCES "public"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salePromise" ADD CONSTRAINT "salePromise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salePromise" ADD CONSTRAINT "salePromise_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salePromiseProduct" ADD CONSTRAINT "salePromiseProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."salePromiseProduct" ADD CONSTRAINT "salePromiseProduct_promise_id_fkey" FOREIGN KEY ("promise_id") REFERENCES "public"."salePromise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."saleInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventory" ADD CONSTRAINT "inventory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventoryItem" ADD CONSTRAINT "inventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inventoryItem" ADD CONSTRAINT "inventoryItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "ProductPromotionRelation" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Promotion" ADD CONSTRAINT "Promotion_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appSetting" ADD CONSTRAINT "appSetting_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "public"."institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rolePermission" ADD CONSTRAINT "rolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rolePermission" ADD CONSTRAINT "rolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "public"."designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_claimTocustomer" ADD CONSTRAINT "_claimTocustomer_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_claimTocustomer" ADD CONSTRAINT "_claimTocustomer_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_claimTouser" ADD CONSTRAINT "_claimTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_claimTouser" ADD CONSTRAINT "_claimTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
