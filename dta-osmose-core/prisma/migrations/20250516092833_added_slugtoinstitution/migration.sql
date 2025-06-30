/*
  Warnings:

  - You are about to drop the column `institution` on the `customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `institution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `institution` table without a default value. This is not possible if the table is not empty.
  - Made the column `EANCode` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brand` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `designation` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institutionId` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `restockingThreshold` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warehouse` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_institutionId_fkey";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "institution";

-- AlterTable
ALTER TABLE "institution" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "EANCode" SET NOT NULL,
ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "designation" SET NOT NULL,
ALTER COLUMN "institutionId" SET NOT NULL,
ALTER COLUMN "restockingThreshold" SET NOT NULL,
ALTER COLUMN "warehouse" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "institution_slug_key" ON "institution"("slug");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
