import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../jwt-auth.guard'
import { GetUserId } from '../../user/auth/get-user-id.decorator'
import { AddTrackerTimesheetEntryDto, CreateTrackerIssueDto, UpdateTrackerIssueDto, UpdateTrackerProfileDto } from '../../dto/tracker.dto'
import { TrackerService } from './tracker.service'

@ApiTags('Tracker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tracker')
export class TrackerController {
  constructor(private readonly tracker: TrackerService) {}

  @Get('issues')
  @ApiOperation({ summary: 'Список задач tracker' })
  listIssues(@Query('query') query?: string) {
    return this.tracker.listIssues(query)
  }

  @Post('issues')
  @ApiOperation({ summary: 'Создать задачу tracker' })
  createIssue(@GetUserId() userId: string, @Body() dto: CreateTrackerIssueDto) {
    return this.tracker.createIssue(userId, dto)
  }

  @Get('issues/:id')
  @ApiOperation({ summary: 'Получить задачу tracker по id' })
  getIssue(@Param('id') id: string) {
    return this.tracker.getIssue(id)
  }

  @Patch('issues/:id')
  @ApiOperation({ summary: 'Обновить задачу tracker' })
  updateIssue(@Param('id') id: string, @Body() dto: UpdateTrackerIssueDto) {
    return this.tracker.updateIssue(id, dto)
  }

  @Get('assignees')
  @ApiOperation({ summary: 'Список исполнителей tracker' })
  listAssignees() {
    return this.tracker.listAssignees()
  }

  @Get('timesheet')
  @ApiOperation({ summary: 'Таймшит tracker' })
  getTimesheet(@GetUserId() userId: string) {
    return this.tracker.getTimesheet(userId)
  }

  @Post('timesheet/entries')
  @ApiOperation({ summary: 'Записать часы в таймшит tracker' })
  addTimesheetEntry(@GetUserId() userId: string, @Body() dto: AddTrackerTimesheetEntryDto) {
    return this.tracker.addTimesheetEntry(userId, dto)
  }

  @Get('profile')
  @ApiOperation({ summary: 'Профиль пользователя tracker' })
  getProfile(@GetUserId() userId: string) {
    return this.tracker.getProfile(userId)
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль tracker' })
  updateProfile(@GetUserId() userId: string, @Body() dto: UpdateTrackerProfileDto) {
    return this.tracker.updateProfile(userId, dto)
  }
}
