import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator'

export class CreateMiroBoardDto {
  @ApiProperty({ example: 'Mind map' })
  @IsString()
  @IsNotEmpty()
  title: string
}

export class UpdateMiroBoardDto {
  @ApiPropertyOptional({ example: 'Новая доска' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean
}

export class CreateMiroNodeDto {
  @ApiPropertyOptional({ example: 'STICKY', enum: ['STICKY', 'TEXT', 'FRAME'] })
  @IsOptional()
  @IsString()
  @IsIn(['STICKY', 'TEXT', 'FRAME'])
  type?: 'STICKY' | 'TEXT' | 'FRAME'

  @ApiProperty({ example: 120 })
  @IsNumber()
  x: number

  @ApiProperty({ example: 80 })
  @IsNumber()
  y: number

  @ApiPropertyOptional({ example: 240 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  w?: number

  @ApiPropertyOptional({ example: 140 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  h?: number

  @ApiPropertyOptional({ example: 'Идея' })
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional({ example: '#FBBF24' })
  @IsOptional()
  @IsString()
  color?: string

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  rotation?: number

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  zIndex?: number

  @ApiPropertyOptional({ example: '{"shape":"rounded"}' })
  @IsOptional()
  @IsString()
  data?: string
}

export class UpdateMiroNodeDto {
  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  x?: number

  @ApiPropertyOptional({ example: 80 })
  @IsOptional()
  @IsNumber()
  y?: number

  @ApiPropertyOptional({ example: 240 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  w?: number

  @ApiPropertyOptional({ example: 140 })
  @IsOptional()
  @IsNumber()
  @Min(20)
  h?: number

  @ApiPropertyOptional({ example: 'Текст' })
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional({ example: '#A78BFA' })
  @IsOptional()
  @IsString()
  color?: string

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  rotation?: number

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  zIndex?: number

  @ApiPropertyOptional({ example: '{"foo":"bar"}' })
  @IsOptional()
  @IsString()
  data?: string
}

export class SyncMiroNodeDto extends UpdateMiroNodeDto {
  @ApiPropertyOptional({ example: 'uuid' })
  @IsOptional()
  @IsString()
  id?: string

  @ApiPropertyOptional({ example: 'STICKY', enum: ['STICKY', 'TEXT', 'FRAME'] })
  @IsOptional()
  @IsString()
  @IsIn(['STICKY', 'TEXT', 'FRAME'])
  type?: 'STICKY' | 'TEXT' | 'FRAME'
}

export class SyncMiroBoardDto {
  @ApiProperty({ type: [SyncMiroNodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncMiroNodeDto)
  nodes: SyncMiroNodeDto[]
}

