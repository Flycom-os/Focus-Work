/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `YtIssue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."YtIssue" ALTER COLUMN "numericId" DROP DEFAULT;
DROP SEQUENCE "YtIssue_numericId_seq";

-- CreateIndex
CREATE UNIQUE INDEX "YtIssue_key_key" ON "public"."YtIssue"("key");
