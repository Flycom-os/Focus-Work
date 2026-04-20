import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../prisma/prisma/prisma.service'
import { CreateMiroBoardDto, CreateMiroNodeDto, SyncMiroBoardDto, UpdateMiroBoardDto, UpdateMiroNodeDto } from '../../dto/miro.dto'

@Injectable()
export class MiroService {
  constructor(private prisma: PrismaService) {}

  async listBoards(ownerId: string) {
    return this.prisma.miroBoard.findMany({
      where: { ownerId, isArchived: false },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        icon: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { nodes: true } },
      },
    })
  }

  async createBoard(ownerId: string, dto: CreateMiroBoardDto) {
    return this.prisma.miroBoard.create({
      data: { ownerId, title: dto.title },
    })
  }

  async getBoard(ownerId: string, boardId: string) {
    const board = await this.prisma.miroBoard.findUnique({
      where: { id: boardId },
      include: { nodes: { orderBy: { updatedAt: 'asc' } } },
    })
    if (!board) throw new NotFoundException('Доска не найдена')
    if (board.ownerId !== ownerId) throw new ForbiddenException('Нет доступа к доске')
    return board
  }

  async updateBoard(ownerId: string, boardId: string, dto: UpdateMiroBoardDto) {
    await this.getBoard(ownerId, boardId)
    return this.prisma.miroBoard.update({
      where: { id: boardId },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.isArchived !== undefined ? { isArchived: dto.isArchived } : {}),
      },
    })
  }

  async deleteBoard(ownerId: string, boardId: string) {
    await this.getBoard(ownerId, boardId)
    return this.prisma.miroBoard.delete({ where: { id: boardId } })
  }

  async createNode(ownerId: string, boardId: string, dto: CreateMiroNodeDto) {
    await this.getBoard(ownerId, boardId)
    return this.prisma.miroNode.create({
      data: {
        boardId,
        type: dto.type ?? 'STICKY',
        x: dto.x,
        y: dto.y,
        w: dto.w ?? 240,
        h: dto.h ?? 140,
        text: dto.text,
        color: dto.color,
        rotation: dto.rotation ?? 0,
        zIndex: dto.zIndex ?? 0,
        data: dto.data,
      },
    })
  }

  async updateNode(ownerId: string, nodeId: string, dto: UpdateMiroNodeDto) {
    const node = await this.prisma.miroNode.findUnique({ where: { id: nodeId }, include: { board: true } })
    if (!node) throw new NotFoundException('Нода не найдена')
    if (node.board.ownerId !== ownerId) throw new ForbiddenException('Нет доступа')

    return this.prisma.miroNode.update({
      where: { id: nodeId },
      data: {
        ...(dto.x !== undefined ? { x: dto.x } : {}),
        ...(dto.y !== undefined ? { y: dto.y } : {}),
        ...(dto.w !== undefined ? { w: dto.w } : {}),
        ...(dto.h !== undefined ? { h: dto.h } : {}),
        ...(dto.text !== undefined ? { text: dto.text } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.rotation !== undefined ? { rotation: dto.rotation } : {}),
        ...(dto.zIndex !== undefined ? { zIndex: dto.zIndex } : {}),
        ...(dto.data !== undefined ? { data: dto.data } : {}),
      },
    })
  }

  async deleteNode(ownerId: string, nodeId: string) {
    const node = await this.prisma.miroNode.findUnique({ where: { id: nodeId }, include: { board: true } })
    if (!node) throw new NotFoundException('Нода не найдена')
    if (node.board.ownerId !== ownerId) throw new ForbiddenException('Нет доступа')

    return this.prisma.miroNode.delete({ where: { id: nodeId } })
  }

  async syncBoard(ownerId: string, boardId: string, dto: SyncMiroBoardDto) {
    await this.getBoard(ownerId, boardId)

    return this.prisma.$transaction(async (tx) => {
      for (const n of dto.nodes) {
        const data = {
          boardId,
          type: (n.type as any) ?? undefined,
          x: n.x ?? undefined,
          y: n.y ?? undefined,
          w: n.w ?? undefined,
          h: n.h ?? undefined,
          text: n.text ?? undefined,
          color: n.color ?? undefined,
          rotation: n.rotation ?? undefined,
          zIndex: n.zIndex ?? undefined,
          data: n.data ?? undefined,
        }

        if (n.id) {
          await tx.miroNode.upsert({
            where: { id: n.id },
            create: {
              ...data,
              type: (n.type as any) ?? 'STICKY',
              x: n.x ?? 0,
              y: n.y ?? 0,
              w: n.w ?? 240,
              h: n.h ?? 140,
              rotation: n.rotation ?? 0,
              zIndex: n.zIndex ?? 0,
            },
            update: {
              ...data,
            },
          })
        } else {
          await tx.miroNode.create({
            data: {
              ...data,
              type: (n.type as any) ?? 'STICKY',
              x: n.x ?? 0,
              y: n.y ?? 0,
              w: n.w ?? 240,
              h: n.h ?? 140,
              rotation: n.rotation ?? 0,
              zIndex: n.zIndex ?? 0,
            },
          })
        }
      }

      // touch updatedAt for list ordering
      await tx.miroBoard.update({ where: { id: boardId }, data: {} })

      return tx.miroBoard.findUnique({
        where: { id: boardId },
        include: { nodes: { orderBy: { updatedAt: 'asc' } } },
      })
    })
  }
}

