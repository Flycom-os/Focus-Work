/*
  Warnings:

  - You are about to drop the `MiroBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MiroNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."BoardRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER', 'COMMENTER');

-- CreateEnum
CREATE TYPE "public"."ElementType" AS ENUM ('SHAPE', 'TEXT', 'STICKY', 'IMAGE', 'FRAME', 'EMBED', 'LINE', 'ARROW', 'NOTE', 'CARD');

-- DropForeignKey
ALTER TABLE "public"."MiroBoard" DROP CONSTRAINT "MiroBoard_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MiroNode" DROP CONSTRAINT "MiroNode_boardId_fkey";

-- DropTable
DROP TABLE "public"."MiroBoard";

-- DropTable
DROP TABLE "public"."MiroNode";

-- DropEnum
DROP TYPE "public"."MiroNodeType";

-- CreateTable
CREATE TABLE "public"."Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BoardMember" (
    "id" TEXT NOT NULL,
    "role" "public"."BoardRole" NOT NULL DEFAULT 'VIEWER',
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Element" (
    "id" TEXT NOT NULL,
    "type" "public"."ElementType" NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "rotation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "zIndex" INTEGER NOT NULL,
    "style" JSONB,
    "content" JSONB,
    "boardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "linkedIssueId" TEXT,

    CONSTRAINT "Element_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ElementVersion" (
    "id" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElementVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BoardSnapshot" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoardSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CursorPosition" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CursorPosition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Board_projectId_idx" ON "public"."Board"("projectId");

-- CreateIndex
CREATE INDEX "Board_ownerId_idx" ON "public"."Board"("ownerId");

-- CreateIndex
CREATE INDEX "BoardMember_userId_idx" ON "public"."BoardMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardMember_boardId_userId_key" ON "public"."BoardMember"("boardId", "userId");

-- CreateIndex
CREATE INDEX "Element_boardId_idx" ON "public"."Element"("boardId");

-- CreateIndex
CREATE INDEX "Element_linkedIssueId_idx" ON "public"."Element"("linkedIssueId");

-- CreateIndex
CREATE INDEX "ElementVersion_elementId_idx" ON "public"."ElementVersion"("elementId");

-- CreateIndex
CREATE INDEX "ElementVersion_authorId_idx" ON "public"."ElementVersion"("authorId");

-- CreateIndex
CREATE INDEX "BoardSnapshot_boardId_idx" ON "public"."BoardSnapshot"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "CursorPosition_boardId_userId_key" ON "public"."CursorPosition"("boardId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardMember" ADD CONSTRAINT "BoardMember_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardMember" ADD CONSTRAINT "BoardMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Element" ADD CONSTRAINT "Element_linkedIssueId_fkey" FOREIGN KEY ("linkedIssueId") REFERENCES "public"."YtIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ElementVersion" ADD CONSTRAINT "ElementVersion_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "public"."Element"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ElementVersion" ADD CONSTRAINT "ElementVersion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoardSnapshot" ADD CONSTRAINT "BoardSnapshot_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
