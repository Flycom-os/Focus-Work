-- CreateTable
CREATE TABLE "TrackerIssue" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'No Type',
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "state" TEXT NOT NULL DEFAULT 'Open',
    "subsystem" TEXT NOT NULL DEFAULT 'No Subsystem',
    "project" TEXT NOT NULL DEFAULT 'WHS',
    "assigneeId" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "TrackerTimeEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekTitle" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "issueKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackerIssue_key_key" ON "TrackerIssue"("key");

-- CreateIndex
CREATE INDEX "TrackerIssue_boardId_idx" ON "TrackerIssue"("boardId");

-- CreateIndex
CREATE INDEX "TrackerIssue_assigneeId_idx" ON "TrackerIssue"("assigneeId");

-- CreateIndex
CREATE INDEX "TrackerIssue_creatorId_idx" ON "TrackerIssue"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackerTimeEntry_userId_weekTitle_day_key" ON "TrackerTimeEntry"("userId", "weekTitle", "day");

-- CreateIndex
CREATE INDEX "TrackerTimeEntry_userId_idx" ON "TrackerTimeEntry"("userId");

-- AddForeignKey
ALTER TABLE "TrackerIssue" ADD CONSTRAINT "TrackerIssue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackerIssue" ADD CONSTRAINT "TrackerIssue_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackerTimeEntry" ADD CONSTRAINT "TrackerTimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

