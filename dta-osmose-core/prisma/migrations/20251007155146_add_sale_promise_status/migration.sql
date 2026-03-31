-- CreateEnum
CREATE TYPE "public"."SalePromiseStatus" AS ENUM ('CAPTURED', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST');

-- AlterTable
ALTER TABLE "public"."salePromise" ADD COLUMN     "statusPipeline" "public"."SalePromiseStatus" NOT NULL DEFAULT 'CAPTURED';
