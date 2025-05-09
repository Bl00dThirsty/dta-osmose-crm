/*
  Warnings:

  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyHolidayId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `award` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `awardHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `designationHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[CnpsId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "awardHistory" DROP CONSTRAINT "awardHistory_awardId_fkey";

-- DropForeignKey
ALTER TABLE "awardHistory" DROP CONSTRAINT "awardHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "designationHistory" DROP CONSTRAINT "designationHistory_designationId_fkey";

-- DropForeignKey
ALTER TABLE "designationHistory" DROP CONSTRAINT "designationHistory_userId_fkey";

-- DropIndex
DROP INDEX "designation_name_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "country",
DROP COLUMN "image",
DROP COLUMN "state",
DROP COLUMN "weeklyHolidayId",
ADD COLUMN     "CnpsId" TEXT,
ADD COLUMN     "designationId" INTEGER,
ADD COLUMN     "emergencyPhone1" TEXT,
ADD COLUMN     "emergencylink1" TEXT,
ADD COLUMN     "emergencyname1" TEXT,
ADD COLUMN     "gender" TEXT;

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "attendance";

-- DropTable
DROP TABLE "award";

-- DropTable
DROP TABLE "awardHistory";

-- DropTable
DROP TABLE "designationHistory";

-- CreateIndex
CREATE UNIQUE INDEX "user_CnpsId_key" ON "user"("CnpsId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
