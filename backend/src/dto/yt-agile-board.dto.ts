import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, IsJSON, IsArray } from 'class-validator';

export class CreateYtAgileBoardDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsBoolean()
    @IsOptional()
    isScrum?: boolean;
}

export class UpdateYtAgileBoardDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    isScrum?: boolean;

    @IsString()
    @IsOptional()
    swimlaneField?: string;

    @IsString()
    @IsOptional()
    filterQuery?: string;
}

export class BoardColumnDto {
    @IsUUID()
    @IsOptional() // Optional for creation
    id?: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsUUID('all', { each: true })
    stateIds: string[];
}

export class ReorderBoardColumnsDto {
    @IsArray()
    @IsNotEmpty({ each: true })
    columns: { id: string, order: number }[];
}
