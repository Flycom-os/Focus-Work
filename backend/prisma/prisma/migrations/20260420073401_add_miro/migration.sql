-- CreateEnum
CREATE TYPE "public"."MiroNodeType" AS ENUM ('STICKY', 'TEXT', 'FRAME');

-- CreateTable
CREATE TABLE "public"."MiroBoard" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiroBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MiroNode" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "type" "public"."MiroNodeType" NOT NULL DEFAULT 'STICKY',
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "w" DOUBLE PRECISION NOT NULL DEFAULT 240,
    "h" DOUBLE PRECISION NOT NULL DEFAULT 140,
    "rotation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "text" TEXT,
    "color" TEXT,
    "data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MiroNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MiroBoard_ownerId_idx" ON "public"."MiroBoard"("ownerId");

-- CreateIndex
CREATE INDEX "MiroNode_boardId_idx" ON "public"."MiroNode"("boardId");

-- AddForeignKey
ALTER TABLE "public"."MiroBoard" ADD CONSTRAINT "MiroBoard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MiroNode" ADD CONSTRAINT "MiroNode_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."MiroBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
