/*
  Warnings:

  - The `nextRdv` column on the `Reporting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reporting" DROP COLUMN "nextRdv",
ADD COLUMN     "nextRdv" TIMESTAMP(3);
