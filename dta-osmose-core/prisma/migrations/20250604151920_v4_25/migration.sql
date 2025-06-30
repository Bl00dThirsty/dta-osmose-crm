/*
  Warnings:

  - Added the required column `institutionId` to the `appSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appSetting" ADD COLUMN     "institutionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "appSetting" ADD CONSTRAINT "appSetting_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
