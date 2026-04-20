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
  private issues: TrackerIssue[] = [
    {
      id: 'fw-39',
      key: 'FW-39',
      summary: 'pages',
      boardId: 'whs',
      type: 'FRONT',
      priority: 'Normal',
      state: 'Open',
      assigneeId: null,
      assignee: 'Nicka_CC',
      subsystem: 'No Subsystem',
      project: 'WHS',
      updatedAt: '2025-11-24',
    },
    {
      id: 'fw-38',
      key: 'FW-38',
      summary: 'pages',
      boardId: 'whs',
      type: 'C++',
      priority: 'Normal',
      state: 'Open',
      assigneeId: null,
      assignee: 'Nicka_CC',
      subsystem: 'No Subsystem',
      project: 'WHS',
      updatedAt: '2025-11-24',
    },
    {
      id: 'fw-37',
      key: 'FW-37',
      summary: 'sidebar',
      boardId: 'whs',
      type: 'FRONT',
      priority: 'Normal',
      state: 'Open',
      assigneeId: null,
      assignee: 'Nicka_CC',
      subsystem: 'No Subsystem',
      project: 'WHS',
      updatedAt: '2025-11-24',
    },
  ]
  private timesheetDays: Array<{ day: string; hours: number }> = [
    { day: 'SUN 15', hours: 0 },
    { day: 'MON 16', hours: 0 },
    { day: 'TUE 17', hours: 0 },
    { day: 'WED 18', hours: 0 },
    { day: 'THU 19', hours: 0 },
    { day: 'FRI 20', hours: 0 },
    { day: 'SAT 21', hours: 0 },
  ]

  constructor(private prisma: PrismaService) {}

  listIssues(query?: string) {
    if (!query?.trim()) return this.issues
    const q = query.trim().toLowerCase()
    return this.issues.filter((issue) => `${issue.key} ${issue.summary} ${issue.assignee}`.toLowerCase().includes(q))
  }

  async createIssue(dto: CreateTrackerIssueDto) {
    const next = this.issues.length + 40
    const assignee = dto.assigneeId
      ? await this.prisma.user.findUnique({ where: { id: dto.assigneeId }, select: { id: true, fullName: true } })
      : null
    const issue: TrackerIssue = {
      id: `fw-${next}`,
      key: `FW-${next}`,
      summary: dto.summary,
      boardId: (dto.project || 'WHS').toLowerCase(),
      type: 'No Type',
      priority: 'Normal',
      state: 'Open',
      assigneeId: assignee?.id ?? null,
      assignee: assignee?.fullName ?? 'Unassigned',
      subsystem: 'No Subsystem',
      project: dto.project || 'WHS',
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    this.issues = [issue, ...this.issues]
    return issue
  }

  getIssue(id: string) {
    const issue = this.issues.find((x) => x.id === id)
    if (!issue) throw new NotFoundException('Задача не найдена')
    return issue
  }

  async updateIssue(id: string, dto: UpdateTrackerIssueDto) {
    const idx = this.issues.findIndex((x) => x.id === id)
    if (idx === -1) throw new NotFoundException('Задача не найдена')
    const current = this.issues[idx]
    const assignee = dto.assigneeId
      ? await this.prisma.user.findUnique({ where: { id: dto.assigneeId }, select: { id: true, fullName: true } })
      : dto.assigneeId === null
        ? { id: null, fullName: 'Unassigned' }
        : null
    const next: TrackerIssue = {
      ...current,
      ...(dto.summary !== undefined ? { summary: dto.summary } : {}),
      ...(dto.type !== undefined ? { type: dto.type } : {}),
      ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
      ...(dto.state !== undefined ? { state: dto.state } : {}),
      ...(dto.assignee !== undefined ? { assignee: dto.assignee } : {}),
      ...(dto.assigneeId !== undefined
        ? {
            assigneeId: assignee?.id ?? null,
            assignee: assignee?.fullName ?? 'Unassigned',
          }
        : {}),
      ...(dto.subsystem !== undefined ? { subsystem: dto.subsystem } : {}),
      ...(dto.project !== undefined
        ? {
            project: dto.project,
            boardId: dto.project.toLowerCase(),
          }
        : {}),
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    this.issues[idx] = next
    return next
  }

  getTimesheet() {
    const days = this.timesheetDays.map((d) => ({ ...d }))
    const spentTime = days.reduce((acc, day) => acc + day.hours, 0)
    return {
      weekTitle: 'March 15 - 21, 2026',
      spentTime,
      days,
    }
  }

  addTimesheetEntry(dto: AddTrackerTimesheetEntryDto) {
    const idx = this.timesheetDays.findIndex((d) => d.day === dto.day)
    if (idx === -1) throw new NotFoundException('День не найден в текущей неделе')
    this.timesheetDays[idx] = { ...this.timesheetDays[idx], hours: dto.hours }
    return this.getTimesheet()
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
}
