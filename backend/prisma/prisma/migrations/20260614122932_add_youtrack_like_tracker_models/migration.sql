-- CreateEnum
CREATE TYPE "public"."YtIssueLinkType" AS ENUM ('RELATES_TO', 'BLOCKS', 'IS_BLOCKED_BY', 'DUPLICATES', 'IS_DUPLICATED_BY', 'SUBTASK_OF', 'PARENT_FOR');

-- CreateEnum
CREATE TYPE "public"."YtCustomFieldType" AS ENUM ('STRING', 'INTEGER', 'FLOAT', 'DATE', 'DATETIME', 'BOOLEAN', 'ENUM_SINGLE', 'ENUM_MULTI', 'USER_SINGLE', 'USER_MULTI', 'MARKDOWN', 'URL');

-- CreateEnum
CREATE TYPE "public"."YtDashboardWidgetType" AS ENUM ('SAVED_SEARCH', 'BURNDOWN', 'VELOCITY', 'CUSTOM');

-- AlterTable
ALTER TABLE "public"."TrackerIssue" ADD CONSTRAINT "TrackerIssue_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."TrackerTimeEntry" ADD CONSTRAINT "TrackerTimeEntry_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."YtProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "YtProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtProjectMember" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'READ',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YtProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtIssue" (
    "id" TEXT NOT NULL,
    "numericId" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "estimation" INTEGER,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "typeId" TEXT,
    "stateId" TEXT,
    "priorityId" TEXT,
    "sprintId" TEXT,
    "parentId" TEXT,

    CONSTRAINT "YtIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtIssueType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "projectId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "YtIssueType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtIssueState" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#8A8A8A',
    "projectId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "YtIssueState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtIssuePriority" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "color" TEXT,
    "projectId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "YtIssuePriority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtIssueLink" (
    "id" TEXT NOT NULL,
    "linkType" "public"."YtIssueLinkType" NOT NULL,
    "sourceIssueId" TEXT NOT NULL,
    "targetIssueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YtIssueLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."YtCustomFieldType" NOT NULL,
    "projectId" TEXT NOT NULL,
    "settings" JSONB,

    CONSTRAINT "YtCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtCustomFieldValue" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "stringValue" TEXT,
    "integerValue" INTEGER,
    "floatValue" DOUBLE PRECISION,
    "datetimeValue" TIMESTAMP(3),
    "booleanValue" BOOLEAN,
    "jsonValue" JSONB,

    CONSTRAINT "YtCustomFieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtSprint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "YtSprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtAgileBoard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isScrum" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,
    "activeSprintId" TEXT,
    "swimlaneField" TEXT,
    "filterQuery" TEXT,

    CONSTRAINT "YtAgileBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtBoardColumn" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wipLimit" INTEGER,
    "boardId" TEXT NOT NULL,
    "states" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "YtBoardColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtComment" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "YtComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtAttachment" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" TEXT,

    CONSTRAINT "YtAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtWorklog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "YtWorklog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtIssueHistory" (
    "id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "YtIssueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtSavedSearch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "YtSavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtDashboard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "projectId" TEXT,
    "layout" JSONB,

    CONSTRAINT "YtDashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YtDashboardWidget" (
    "id" TEXT NOT NULL,
    "dashboardId" TEXT NOT NULL,
    "type" "public"."YtDashboardWidgetType" NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "YtDashboardWidget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YtProject_key_key" ON "public"."YtProject"("key");

-- CreateIndex
CREATE UNIQUE INDEX "YtProjectMember_projectId_userId_key" ON "public"."YtProjectMember"("projectId", "userId");

-- CreateIndex
CREATE INDEX "YtIssue_assigneeId_idx" ON "public"."YtIssue"("assigneeId");

-- CreateIndex
CREATE INDEX "YtIssue_authorId_idx" ON "public"."YtIssue"("authorId");

-- CreateIndex
CREATE INDEX "YtIssue_stateId_idx" ON "public"."YtIssue"("stateId");

-- CreateIndex
CREATE INDEX "YtIssue_sprintId_idx" ON "public"."YtIssue"("sprintId");

-- CreateIndex
CREATE UNIQUE INDEX "YtIssue_projectId_numericId_key" ON "public"."YtIssue"("projectId", "numericId");

-- CreateIndex
CREATE UNIQUE INDEX "YtIssueType_projectId_name_key" ON "public"."YtIssueType"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "YtIssueState_projectId_name_key" ON "public"."YtIssueState"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "YtIssuePriority_projectId_name_key" ON "public"."YtIssuePriority"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "YtIssueLink_sourceIssueId_targetIssueId_linkType_key" ON "public"."YtIssueLink"("sourceIssueId", "targetIssueId", "linkType");

-- CreateIndex
CREATE UNIQUE INDEX "YtCustomField_projectId_name_key" ON "public"."YtCustomField"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "YtCustomFieldValue_issueId_customFieldId_key" ON "public"."YtCustomFieldValue"("issueId", "customFieldId");

-- CreateIndex
CREATE UNIQUE INDEX "YtSprint_projectId_name_key" ON "public"."YtSprint"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "YtAgileBoard_projectId_name_key" ON "public"."YtAgileBoard"("projectId", "name");

-- CreateIndex
CREATE INDEX "YtComment_issueId_idx" ON "public"."YtComment"("issueId");

-- CreateIndex
CREATE INDEX "YtWorklog_issueId_idx" ON "public"."YtWorklog"("issueId");

-- CreateIndex
CREATE INDEX "YtIssueHistory_issueId_idx" ON "public"."YtIssueHistory"("issueId");

-- CreateIndex
CREATE UNIQUE INDEX "YtSavedSearch_ownerId_projectId_name_key" ON "public"."YtSavedSearch"("ownerId", "projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "YtDashboard_ownerId_name_key" ON "public"."YtDashboard"("ownerId", "name");

-- AddForeignKey
ALTER TABLE "public"."YtProject" ADD CONSTRAINT "YtProject_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtProjectMember" ADD CONSTRAINT "YtProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtProjectMember" ADD CONSTRAINT "YtProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."YtIssueType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."YtIssueState"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "public"."YtIssuePriority"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "public"."YtSprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssue" ADD CONSTRAINT "YtIssue_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."YtIssue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."YtIssueType" ADD CONSTRAINT "YtIssueType_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssueState" ADD CONSTRAINT "YtIssueState_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssuePriority" ADD CONSTRAINT "YtIssuePriority_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssueLink" ADD CONSTRAINT "YtIssueLink_sourceIssueId_fkey" FOREIGN KEY ("sourceIssueId") REFERENCES "public"."YtIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssueLink" ADD CONSTRAINT "YtIssueLink_targetIssueId_fkey" FOREIGN KEY ("targetIssueId") REFERENCES "public"."YtIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtCustomField" ADD CONSTRAINT "YtCustomField_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtCustomFieldValue" ADD CONSTRAINT "YtCustomFieldValue_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."YtIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtCustomFieldValue" ADD CONSTRAINT "YtCustomFieldValue_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "public"."YtCustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtSprint" ADD CONSTRAINT "YtSprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtAgileBoard" ADD CONSTRAINT "YtAgileBoard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtBoardColumn" ADD CONSTRAINT "YtBoardColumn_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."YtAgileBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtComment" ADD CONSTRAINT "YtComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtComment" ADD CONSTRAINT "YtComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."YtIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtAttachment" ADD CONSTRAINT "YtAttachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."YtComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtWorklog" ADD CONSTRAINT "YtWorklog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtWorklog" ADD CONSTRAINT "YtWorklog_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."YtIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssueHistory" ADD CONSTRAINT "YtIssueHistory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtIssueHistory" ADD CONSTRAINT "YtIssueHistory_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "public"."YtIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtSavedSearch" ADD CONSTRAINT "YtSavedSearch_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtSavedSearch" ADD CONSTRAINT "YtSavedSearch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtDashboard" ADD CONSTRAINT "YtDashboard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtDashboard" ADD CONSTRAINT "YtDashboard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."YtProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."YtDashboardWidget" ADD CONSTRAINT "YtDashboardWidget_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "public"."YtDashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
