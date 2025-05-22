-- CreateEnum
CREATE TYPE "typCat" AS ENUM ('Pharmacie', 'Distributeur');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entityId" INTEGER,
    "entityType" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "appSetting" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "tag_line" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "footer" TEXT NOT NULL,

    CONSTRAINT "appSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "inTime" TIMESTAMP(3) NOT NULL,
    "outTime" TIMESTAMP(3),
    "ip" TEXT,
    "comment" TEXT,
    "punchBy" INTEGER,
    "totalHour" DOUBLE PRECISION,
    "inTimeStatus" TEXT,
    "outTimeStatus" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "awardHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "awardId" INTEGER NOT NULL,
    "awardedDate" TIMESTAMP(3) NOT NULL,
    "comment" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "awardHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" TEXT NOT NULL,
    "customId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
<<<<<<<< HEAD:dta-osmose-core/prisma/migrations/20250502142808_init/migration.sql
    "ville" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "region" TEXT,
    "nameresponsable" TEXT DEFAULT '',
    "email" TEXT DEFAULT '',
========
    "address" TEXT NOT NULL,
    "nameresponsable" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
>>>>>>>> origin/yvana:dta-osmose-core/prisma/migrations/20250502152820_v1/migration.sql
    "website" TEXT DEFAULT '',
    "status" BOOLEAN DEFAULT true,
    "type_customer" "typCat" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerCounter" (
    "id" SERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CustomerCounter_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "designationHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "designationId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "comment" TEXT,

    CONSTRAINT "designationHistory_pkey" PRIMARY KEY ("id")
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
    "institution" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
<<<<<<<< HEAD:dta-osmose-core/prisma/migrations/20250502142808_init/migration.sql
CREATE TABLE "ProductCounter" (
    "id" SERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductCounter_pkey" PRIMARY KEY ("id")
========
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
>>>>>>>> origin/yvana:dta-osmose-core/prisma/migrations/20250502152820_v1/migration.sql
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
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "joinDate" TIMESTAMP(3),
    "birthday" TEXT,
    "employeeId" TEXT,
    "bloodGroup" TEXT,
    "image" TEXT,
    "departmentId" INTEGER,
    "role" TEXT,
    "salary" DOUBLE PRECISION,
    "weeklyHolidayId" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "award_name_key" ON "award"("name");

-- CreateIndex
CREATE UNIQUE INDEX "customer_customId_key" ON "customer"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_phone_key" ON "customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCounter_institution_month_year_key" ON "CustomerCounter"("institution", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "designation_name_key" ON "designation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_EANCode_key" ON "product"("EANCode");

-- CreateIndex
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");

-- CreateIndex
<<<<<<<< HEAD:dta-osmose-core/prisma/migrations/20250502142808_init/migration.sql
CREATE UNIQUE INDEX "ProductCounter_institution_month_year_key" ON "ProductCounter"("institution", "month", "year");
========
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rolePermission_role_id_permission_id_key" ON "rolePermission"("role_id", "permission_id");
>>>>>>>> origin/yvana:dta-osmose-core/prisma/migrations/20250502152820_v1/migration.sql

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "user"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_employeeId_key" ON "user"("employeeId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awardHistory" ADD CONSTRAINT "awardHistory_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "award"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "awardHistory" ADD CONSTRAINT "awardHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designationHistory" ADD CONSTRAINT "designationHistory_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "designation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designationHistory" ADD CONSTRAINT "designationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
