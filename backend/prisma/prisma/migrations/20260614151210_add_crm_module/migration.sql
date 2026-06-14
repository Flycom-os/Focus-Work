-- CreateEnum
CREATE TYPE "public"."CrmDealStatus" AS ENUM ('LEAD', 'CONTACT_MADE', 'PROPOSAL_SENT', 'IN_NEGOTIATION', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "public"."CrmStockMovementType" AS ENUM ('INBOUND', 'OUTBOUND', 'TRANSFER', 'ADJUSTMENT', 'RETURN');

-- CreateEnum
CREATE TYPE "public"."CrmCameraEventType" AS ENUM ('MOTION_DETECTED', 'AREA_ENTERED', 'AREA_EXITED', 'LINE_CROSSED', 'FACE_RECOGNIZED', 'LICENSE_PLATE_RECOGNIZED', 'TAMPERING_DETECTED');

-- AlterEnum
ALTER TYPE "public"."ElementType" ADD VALUE 'DRAW';

-- AlterTable
CREATE SEQUENCE "public".ytissue_numericid_seq;
ALTER TABLE "public"."YtIssue" ALTER COLUMN "numericId" SET DEFAULT nextval('"public".ytissue_numericid_seq');
ALTER SEQUENCE "public".ytissue_numericid_seq OWNED BY "public"."YtIssue"."numericId";

-- CreateTable
CREATE TABLE "public"."CrmContact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmDeal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "public"."CrmDealStatus" NOT NULL DEFAULT 'LEAD',
    "amount" DOUBLE PRECISION NOT NULL,
    "companyId" TEXT,
    "contactId" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmWarehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmWarehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmStock" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmStockMovement" (
    "id" TEXT NOT NULL,
    "type" "public"."CrmStockMovementType" NOT NULL,
    "stockId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmStockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmOrder" (
    "id" TEXT NOT NULL,
    "dealId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmShipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmCamera" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rtspUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmCamera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CrmCameraEvent" (
    "id" TEXT NOT NULL,
    "cameraId" TEXT NOT NULL,
    "type" "public"."CrmCameraEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmCameraEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrmContact_email_key" ON "public"."CrmContact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CrmProduct_sku_key" ON "public"."CrmProduct"("sku");

-- AddForeignKey
ALTER TABLE "public"."CrmContact" ADD CONSTRAINT "CrmContact_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmDeal" ADD CONSTRAINT "CrmDeal_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmDeal" ADD CONSTRAINT "CrmDeal_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."CrmContact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmDeal" ADD CONSTRAINT "CrmDeal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmStock" ADD CONSTRAINT "CrmStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."CrmProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmStock" ADD CONSTRAINT "CrmStock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "public"."CrmWarehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmStockMovement" ADD CONSTRAINT "CrmStockMovement_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."CrmStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmOrder" ADD CONSTRAINT "CrmOrder_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "public"."CrmDeal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmShipment" ADD CONSTRAINT "CrmShipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."CrmOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CrmCameraEvent" ADD CONSTRAINT "CrmCameraEvent_cameraId_fkey" FOREIGN KEY ("cameraId") REFERENCES "public"."CrmCamera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
