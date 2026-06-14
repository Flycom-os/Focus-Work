import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoardRole, ElementType } from '@prisma/client';
import {
  IsEnum,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoardDto {
  @ApiProperty({ example: 'My New Awesome Board' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'A board for brainstorming creative ideas.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'c1b9b3b4-0b3f-4e4a-9b1b-9b3b4e4a9b1b',
    description: 'ID of the project this board belongs to.',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the board is publicly accessible.',
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateBoardDto {
  @ApiPropertyOptional({ example: 'My Updated Board Name' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the board is publicly accessible.',
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Board-specific settings in JSON format.',
    example: { theme: 'dark', snapToGrid: true },
  })
  @IsOptional()
  settings?: any;
}

export class AddBoardMemberDto {
  @ApiProperty({
    example: 'a1b9b3b4-0b3f-4e4a-9b1b-9b3b4e4a9b1c',
    description: 'The ID of the user to add to the board.',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    enum: BoardRole,
    example: BoardRole.EDITOR,
    description: 'The role to assign to the new member.',
  })
  @IsEnum(BoardRole)
  role: BoardRole;
}

export class UpdateBoardMemberDto {
  @ApiProperty({
    enum: BoardRole,
    example: BoardRole.VIEWER,
    description: 'The new role for the board member.',
  })
  @IsEnum(BoardRole)
  role: BoardRole;
}

// DTO for syncing elements from the frontend (tldraw)
export class SyncElementDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty({ enum: ElementType })
  @IsEnum(ElementType)
  type: ElementType;

  @ApiProperty()
  @IsNumber()
  x: number;

  @ApiProperty()
  @IsNumber()
  y: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  rotation: number;

  @ApiProperty()
  @IsNumber()
  zIndex: number;

  @ApiPropertyOptional()
  @IsOptional()
  style?: any;

  @ApiPropertyOptional()
  @IsOptional()
  content?: any;
  
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  linkedIssueId?: string;
}

export class SyncBoardDto {
  @ApiProperty({ type: [SyncElementDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncElementDto)
  elements: SyncElementDto[];

  @ApiProperty({ description: "IDs of elements to delete" })
  @IsArray()
  @IsUUID(undefined, { each: true })
  deletedElementIds: string[];
}
