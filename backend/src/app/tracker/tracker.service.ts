import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../../prisma/prisma/prisma.service'
import { AddTrackerTimesheetEntryDto, CreateTrackerIssueDto, UpdateTrackerIssueDto, UpdateTrackerProfileDto } from '../../dto/tracker.dto'

type TrackerIssue = {
  id: string
  key: string
  summary: string
  boardId: string
  type: string
  priority: string
  state: string
  assigneeId: string | null
  assignee: string
  subsystem: string
  project: string
  updatedAt: string
}

@Injectable()
export class TrackerService {
  private readonly weekTitle = 'March 15 - 21, 2026'
  private ensureSchemaPromise: Promise<void> | null = null

  constructor(private prisma: PrismaService) {}

  private async ensureTrackerSchema() {
    if (this.ensureSchemaPromise) return this.ensureSchemaPromise
    const prisma = this.prisma as any

    this.ensureSchemaPromise = (async () => {
      // Note: This is a pragmatic fallback for local dev environments where migrations
      // may not have been applied yet. It prevents P2021 "table does not exist".
      // Prefer: `prisma migrate dev` / `prisma migrate deploy` in CI/Prod.
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "TrackerIssue" (
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
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "TrackerIssue_pkey" PRIMARY KEY ("id")
        );
      `)

      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "TrackerIssue_key_key" ON "TrackerIssue"("key");`)
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TrackerIssue_boardId_idx" ON "TrackerIssue"("boardId");`)
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TrackerIssue_assigneeId_idx" ON "TrackerIssue"("assigneeId");`)
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TrackerIssue_creatorId_idx" ON "TrackerIssue"("creatorId");`)

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "TrackerTimeEntry" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "weekTitle" TEXT NOT NULL,
          "day" TEXT NOT NULL,
          "hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "issueKey" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "TrackerTimeEntry_pkey" PRIMARY KEY ("id")
        );
      `)
      await prisma.$executeRawUnsafe(
        `CREATE UNIQUE INDEX IF NOT EXISTS "TrackerTimeEntry_userId_weekTitle_day_key" ON "TrackerTimeEntry"("userId","weekTitle","day");`,
      )
      await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "TrackerTimeEntry_userId_idx" ON "TrackerTimeEntry"("userId");`)
    })()

    return this.ensureSchemaPromise
  }

  async listIssues(query?: string) {
    const prisma = this.prisma as any
    await this.ensureTrackerSchema()
    const q = query?.trim()
    const where = q
      ? {
          OR: [
            { key: { contains: q, mode: 'insensitive' as const } },
            { summary: { contains: q, mode: 'insensitive' as const } },
            { assignee: { fullName: { contains: q, mode: 'insensitive' as const } } },
          ],
        }
      : {}

    const issues = await prisma.trackerIssue.findMany({
      where,
      include: { assignee: { select: { id: true, fullName: true } } },
      orderBy: { updatedAt: 'desc' },
    })

    return issues.map((i) => this.mapIssue(i))
  }

  async createIssue(creatorId: string, dto: CreateTrackerIssueDto) {
    const prisma = this.prisma as any
    await this.ensureTrackerSchema()
    const count = await prisma.trackerIssue.count()
    const key = `FW-${count + 1}`
    const project = dto.project || 'WHS'

    const created = await prisma.trackerIssue.create({
      data: {
        key,
        summary: dto.summary,
        boardId: project.toLowerCase(),
        project,
        creatorId,
        assigneeId: dto.assigneeId || null,
      },
      include: { assignee: { select: { id: true, fullName: true } } },
    })

    return this.mapIssue(created)
  }

  async getIssue(id: string) {
    const prisma = this.prisma as any
    await this.ensureTrackerSchema()
    const issue = await prisma.trackerIssue.findUnique({
      where: { id },
      include: { assignee: { select: { id: true, fullName: true } } },
    })
    if (!issue) throw new NotFoundException('Задача не найдена')
    return this.mapIssue(issue)
  }

  async updateIssue(id: string, dto: UpdateTrackerIssueDto) {
    const prisma = this.prisma as any
    await this.ensureTrackerSchema()
    const updated = await prisma.trackerIssue.update({
      where: { id },
      data: {
        ...(dto.summary !== undefined ? { summary: dto.summary } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.state !== undefined ? { state: dto.state } : {}),
        ...(dto.subsystem !== undefined ? { subsystem: dto.subsystem } : {}),
        ...(dto.project !== undefined
          ? {
              project: dto.project,
              boardId: dto.project.toLowerCase(),
            }
          : {}),
        ...(dto.assigneeId !== undefined ? { assigneeId: dto.assigneeId || null } : {}),
      },
      include: { assignee: { select: { id: true, fullName: true } } },
    })
    return this.mapIssue(updated)
  }

  async getTimesheet(userId: string) {
    const prisma = this.prisma as any
    await this.ensureTrackerSchema()
    const baseDays = ['SUN 15', 'MON 16', 'TUE 17', 'WED 18', 'THU 19', 'FRI 20', 'SAT 21']
    const entries = await prisma.trackerTimeEntry.findMany({
      where: { userId, weekTitle: this.weekTitle },
      select: { day: true, hours: true },
    })
    const map = new Map(entries.map((e) => [e.day, e.hours]))
    const days = baseDays.map((d) => ({ day: d, hours: Number(map.get(d) ?? 0) }))
    const spentTime = days.reduce<number>((acc, d) => acc + d.hours, 0)
    return {
      weekTitle: this.weekTitle,
      spentTime,
      days,
    }
  }

  async addTimesheetEntry(userId: string, dto: AddTrackerTimesheetEntryDto) {
    const prisma = this.prisma as any
    await this.ensureTrackerSchema()
    const baseDays = new Set(['SUN 15', 'MON 16', 'TUE 17', 'WED 18', 'THU 19', 'FRI 20', 'SAT 21'])
    if (!baseDays.has(dto.day)) throw new NotFoundException('День не найден в текущей неделе')

    await prisma.trackerTimeEntry.upsert({
      where: {
        userId_weekTitle_day: {
          userId,
          weekTitle: this.weekTitle,
          day: dto.day,
        },
      },
      create: {
        userId,
        weekTitle: this.weekTitle,
        day: dto.day,
        hours: dto.hours,
        issueKey: dto.issueKey,
      },
      update: {
        hours: dto.hours,
        issueKey: dto.issueKey,
      },
    })

    return this.getTimesheet(userId)
  }

  async listAssignees() {
    const users = await this.prisma.user.findMany({
      select: { id: true, fullName: true, email: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return users.map((user) => ({ id: user.id, name: user.fullName, email: user.email }))
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, icon: true, createdAt: true },
    })
    if (!user) throw new NotFoundException('Пользователь не найден')
    return {
      ...user,
      username: user.fullName,
      vcsUsernames: ['admin', user.email],
      language: 'English',
      timezone: 'UTC',
      dateFormat: '31 Dec 2000 23:59',
    }
  }

  async updateProfile(userId: string, dto: UpdateTrackerProfileDto) {
    const data: Record<string, unknown> = {
      ...(dto.fullName !== undefined ? { fullName: dto.fullName } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
    }
    if (dto.password !== undefined && dto.password.trim()) {
      data.password = await bcrypt.hash(dto.password, 10)
    }
    await this.prisma.user.update({ where: { id: userId }, data })
    return this.getProfile(userId)
  }

  private mapIssue(i: any): TrackerIssue {
    return {
      id: i.id,
      key: i.key,
      summary: i.summary,
      boardId: i.boardId,
      type: i.type,
      priority: i.priority,
      state: i.state,
      assigneeId: i.assigneeId ?? null,
      assignee: i.assignee?.fullName ?? 'Unassigned',
      subsystem: i.subsystem,
      project: i.project,
      updatedAt: i.updatedAt instanceof Date ? i.updatedAt.toISOString().slice(0, 10) : String(i.updatedAt).slice(0, 10),
    }
  }
}
