import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator'

export class UpdateCrmProfileDto {
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
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string
}

export class UpsertCrmWarehouseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string
}

export class UpsertCrmCompanyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  inn?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organizationType?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankLocation?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankBik?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cardNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankAccount?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  correspondentAccount?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kpp?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stampUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  signUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMessage?: string
}

export class UpdateCrmSystemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appColor?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  notifyAfterDays?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramToken?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  autoSendInvoice?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpHost?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpPort?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imapHost?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imapPort?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpUser?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  smtpPassword?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  senderName?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  menu?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  menuMap?: Record<string, boolean>
}
