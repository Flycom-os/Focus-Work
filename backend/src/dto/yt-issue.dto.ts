import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateYtIssueDto {
  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsUUID()
  @IsNotEmpty()
  authorId: string; // This will likely come from the authenticated user

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsUUID()
  @IsOptional()
  typeId?: string;

  @IsUUID()
  @IsOptional()
  stateId?: string;
  
  @IsUUID()
  @IsOptional()
  priorityId?: string;
}

export class UpdateYtIssueDto {
    @IsString()
    @IsOptional()
    summary?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsUUID()
    @IsOptional()
    assigneeId?: string;
  
    @IsUUID()
    @IsOptional()
    typeId?: string;
  
    @IsUUID()
    @IsOptional()
    stateId?: string;
    
    @IsUUID()
    @IsOptional()
    priorityId?: string;
}
