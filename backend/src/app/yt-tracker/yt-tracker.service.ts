import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { CreateYtIssueDto, UpdateYtIssueDto } from '../../dto/yt-issue.dto';
import { parseQuery } from './query-parser';
import { YtIssue } from '@prisma/client';

@Injectable()
export class YtTrackerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createYtIssueDto: CreateYtIssueDto): Promise<YtIssue> {
    const { projectId, summary, description, authorId, assigneeId, typeId, stateId, priorityId } = createYtIssueDto;

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.ytProject.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const latestIssue = await tx.ytIssue.findFirst({
        where: { projectId },
        orderBy: { numericId: 'desc' },
      });

      const newNumericId = latestIssue ? latestIssue.numericId + 1 : 1;
      const newKey = `${project.key}-${newNumericId}`;

      const newIssue = await tx.ytIssue.create({
        data: {
          numericId: newNumericId,
          key: newKey,
          summary,
          description,
          projectId,
          authorId,
          assigneeId,
          typeId,
          stateId,
          priorityId,
        },
      });

      return newIssue;
    });
  }

  async findByQuery(query: string, userId: string): Promise<YtIssue[]> {
    const where = parseQuery(query, userId);
    return this.prisma.ytIssue.findMany({ where });
  }

  async findAll(): Promise<YtIssue[]> {
    return this.prisma.ytIssue.findMany();
  }

  async findOne(id: string): Promise<YtIssue | null> {
    const issue = await this.prisma.ytIssue.findUnique({
      where: { id },
    });
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
    return issue;
  }

  async update(id: string, updateYtIssueDto: UpdateYtIssueDto): Promise<YtIssue> {
    // First, check if the issue exists
    const issueExists = await this.prisma.ytIssue.findUnique({ where: { id } });
    if (!issueExists) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }
    
    return this.prisma.ytIssue.update({
      where: { id },
      data: updateYtIssueDto,
    });
  }

  async remove(id: string): Promise<YtIssue> {
    // First, check if the issue exists
    const issueExists = await this.prisma.ytIssue.findUnique({ where: { id } });
    if (!issueExists) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return this.prisma.ytIssue.delete({
      where: { id },
    });
  }
}
