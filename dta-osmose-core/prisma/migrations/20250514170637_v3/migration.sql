/*
  Warnings:

  - You are about to drop the column `address` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `collisage` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `depense` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `gencode` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `gtsPrice` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `marge` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `marque` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPriceHT` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customId]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[EANCode]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customId` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institution` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarter` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_name_key";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "address",
DROP COLUMN "password",
ADD COLUMN     "customId" TEXT NOT NULL,
ADD COLUMN     "institution" TEXT NOT NULL,
ADD COLUMN     "quarter" TEXT NOT NULL,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "ville" TEXT NOT NULL,
ALTER COLUMN "nameresponsable" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "collisage",
DROP COLUMN "depense",
DROP COLUMN "gencode",
DROP COLUMN "gtsPrice",
DROP COLUMN "label",
DROP COLUMN "marge",
DROP COLUMN "marque",
DROP COLUMN "name",
DROP COLUMN "sellingPriceHT",
DROP COLUMN "signature",
DROP COLUMN "status",
ADD COLUMN     "EANCode" TEXT,
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "institutionId" TEXT,
ADD COLUMN     "restockingThreshold" INTEGER,
ADD COLUMN     "warehouse" TEXT;

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
CREATE TABLE "institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCounter_institution_month_year_key" ON "CustomerCounter"("institution", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCounter_institution_month_year_key" ON "ProductCounter"("institution", "month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "customer_customId_key" ON "customer"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "product_EANCode_key" ON "product"("EANCode");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
