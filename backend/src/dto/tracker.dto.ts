import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class CreateTrackerIssueDto {
  @ApiProperty()
  @IsString()
  summary: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  project?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string
}

export class UpdateTrackerProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string
}

export class UpdateTrackerIssueDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priority?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignee?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assigneeId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subsystem?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  project?: string
}

export class AddTrackerTimesheetEntryDto {
  @ApiProperty({ example: 'MON 16' })
  @IsString()
  day: string

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(0)
  @Max(24)
  hours: number

  @ApiPropertyOptional({ example: 'FW-39' })
  @IsOptional()
  @IsString()
  issueKey?: string
}
