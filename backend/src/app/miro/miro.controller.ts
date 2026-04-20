import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../jwt-auth.guard'
import { GetUserId } from '../../user/auth/get-user-id.decorator'
import { CreateMiroBoardDto, CreateMiroNodeDto, SyncMiroBoardDto, UpdateMiroBoardDto, UpdateMiroNodeDto } from '../../dto/miro.dto'
import { MiroService } from './miro.service'

@ApiTags('Miro')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('miro')
export class MiroController {
  constructor(private readonly miro: MiroService) {}

  @Get('boards')
  @ApiOperation({ summary: 'Список досок текущего пользователя' })
  listBoards(@GetUserId() userId: string) {
    return this.miro.listBoards(userId)
  }

  @Post('boards')
  @ApiOperation({ summary: 'Создать доску' })
  createBoard(@GetUserId() userId: string, @Body() dto: CreateMiroBoardDto) {
    return this.miro.createBoard(userId, dto)
  }

  @Get('boards/:id')
  @ApiOperation({ summary: 'Получить доску с нодами' })
  getBoard(@GetUserId() userId: string, @Param('id') id: string) {
    return this.miro.getBoard(userId, id)
  }

  @Patch('boards/:id')
  @ApiOperation({ summary: 'Обновить доску' })
  updateBoard(@GetUserId() userId: string, @Param('id') id: string, @Body() dto: UpdateMiroBoardDto) {
    return this.miro.updateBoard(userId, id, dto)
  }

  @Patch('boards/:id/sync')
  @ApiOperation({ summary: 'Синхронизировать доску целиком (все ноды)' })
  syncBoard(@GetUserId() userId: string, @Param('id') id: string, @Body() dto: SyncMiroBoardDto) {
    return this.miro.syncBoard(userId, id, dto)
  }

  @Delete('boards/:id')
  @ApiOperation({ summary: 'Удалить доску' })
  deleteBoard(@GetUserId() userId: string, @Param('id') id: string) {
    return this.miro.deleteBoard(userId, id)
  }

  @Post('boards/:id/nodes')
  @ApiOperation({ summary: 'Создать ноду на доске' })
  createNode(@GetUserId() userId: string, @Param('id') boardId: string, @Body() dto: CreateMiroNodeDto) {
    return this.miro.createNode(userId, boardId, dto)
  }

  @Patch('nodes/:id')
  @ApiOperation({ summary: 'Обновить ноду' })
  updateNode(@GetUserId() userId: string, @Param('id') nodeId: string, @Body() dto: UpdateMiroNodeDto) {
    return this.miro.updateNode(userId, nodeId, dto)
  }

  @Delete('nodes/:id')
  @ApiOperation({ summary: 'Удалить ноду' })
  deleteNode(@GetUserId() userId: string, @Param('id') nodeId: string) {
    return this.miro.deleteNode(userId, nodeId)
  }
}

