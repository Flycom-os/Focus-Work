import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { YtAgileBoard } from '@prisma/client';
import { CreateYtAgileBoardDto, UpdateYtAgileBoardDto, BoardColumnDto, ReorderBoardColumnsDto } from '../../dto/yt-agile-board.dto';

@Injectable()
export class YtAgileBoardService {
    constructor(private readonly prisma: PrismaService) {}

    async createBoard(dto: CreateYtAgileBoardDto): Promise<YtAgileBoard> {
        return this.prisma.ytAgileBoard.create({
            data: dto,
        });
    }

    async getBoard(id: string): Promise<YtAgileBoard | null> {
        return this.prisma.ytAgileBoard.findUnique({
            where: { id },
            include: { columns: { orderBy: { order: 'asc' } } },
        });
    }

    async getBoardsForProject(projectId: string): Promise<YtAgileBoard[]> {
        return this.prisma.ytAgileBoard.findMany({
            where: { projectId },
        });
    }

    async updateBoard(id: string, dto: UpdateYtAgileBoardDto): Promise<YtAgileBoard> {
        return this.prisma.ytAgileBoard.update({
            where: { id },
            data: dto,
        });
    }

    async deleteBoard(id: string): Promise<YtAgileBoard> {
        return this.prisma.ytAgileBoard.delete({ where: { id } });
    }

    async setBoardColumns(boardId: string, columns: BoardColumnDto[]): Promise<YtAgileBoard> {
        const board = await this.prisma.ytAgileBoard.findUnique({ where: { id: boardId }});
        if (!board) {
            throw new NotFoundException(`Board with ID ${boardId} not found`);
        }

        // DANGER: This is a simple implementation. It deletes and recreates all columns.
        // A more robust implementation would handle updates and creations granularly.
        await this.prisma.ytBoardColumn.deleteMany({ where: { boardId }});

        const createdColumns = await this.prisma.ytBoardColumn.createMany({
            data: columns.map((col, index) => ({
                name: col.name,
                boardId: boardId,
                states: col.stateIds,
                order: index,
            })),
        });

        return this.getBoard(boardId);
    }
}
