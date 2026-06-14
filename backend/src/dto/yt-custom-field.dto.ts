import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsJSON } from 'class-validator';
import { YtCustomFieldType } from '@prisma/client';

export class CreateYtCustomFieldDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(YtCustomFieldType)
  @IsNotEmpty()
  type: YtCustomFieldType;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsJSON()
  @IsOptional()
  settings?: string; // JSON string for enum options, etc.
}

export class UpdateYtCustomFieldDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsJSON()
  @IsOptional()
  settings?: string;
}

export class SetCustomFieldValueDto {
    @IsUUID()
    @IsNotEmpty()
    issueId: string;

    @IsUUID()
    @IsNotEmpty()
    customFieldId: string;

    @IsOptional()
    stringValue?: string;

    @IsOptional()
    integerValue?: number;

    @IsOptional()
    floatValue?: number;

    @IsOptional()
    datetimeValue?: Date;

    @IsOptional()
    booleanValue?: boolean;

    @IsOptional()
    @IsJSON()
    jsonValue?: string; // For multi-select enums or users
}
