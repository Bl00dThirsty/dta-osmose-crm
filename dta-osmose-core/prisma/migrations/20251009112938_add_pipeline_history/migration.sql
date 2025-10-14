-- CreateTable
CREATE TABLE "public"."PipelineHistory" (
    "id" SERIAL NOT NULL,
    "salePromiseId" INTEGER NOT NULL,
    "previousStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "performedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PipelineHistory_salePromiseId_idx" ON "public"."PipelineHistory"("salePromiseId");

-- AddForeignKey
ALTER TABLE "public"."PipelineHistory" ADD CONSTRAINT "PipelineHistory_salePromiseId_fkey" FOREIGN KEY ("salePromiseId") REFERENCES "public"."salePromise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PipelineHistory" ADD CONSTRAINT "PipelineHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
