-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_productId_fkey";

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "ProductPromotionRelation" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
