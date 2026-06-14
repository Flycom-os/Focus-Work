import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { GetUserId } from '../../user/auth/get-user-id.decorator';
import {
  AddBoardMemberDto,
  CreateBoardDto,
  SyncBoardDto,
  UpdateBoardDto,
  UpdateBoardMemberDto,
} from '../../dto/miro.dto';
import { MiroService } from './miro.service';

@ApiTags('Miro Boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class MiroController {
  constructor(private readonly miroService: MiroService) {}

  // =================================================================
  // Board CRUD
  // =================================================================

  @Get()
  @ApiOperation({ summary: 'List all boards the current user is a member of' })
  listBoards(@GetUserId() userId: string) {
    return this.miroService.listBoards(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  createBoard(@GetUserId() userId: string, @Body() dto: CreateBoardDto) {
    return this.miroService.createBoard(userId, dto);
  }

  @Get(':boardId')
  @ApiOperation({ summary: 'Get a specific board by its ID' })
  getBoard(
    @GetUserId() userId: string,
    @Param('boardId') boardId: string,
  ) {
    return this.miroService.getBoardById(boardId, userId);
  }

  @Patch(':boardId')
  @ApiOperation({ summary: 'Update a board’s details' })
  updateBoard(
    @GetUserId() userId: string,
    @Param('boardId') boardId: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.miroService.updateBoard(boardId, userId, dto);
  }

  @Delete(':boardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a board' })
  async deleteBoard(
    @GetUserId() userId: string,
    @Param('boardId') boardId: string,
  ) {
    await this.miroService.deleteBoard(boardId, userId);
    return;
  }

  // =================================================================
  // Element Sync
  // =================================================================

  @Patch(':boardId/sync')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Sync board elements (create, update, delete)' })
  async syncElements(
      @GetUserId() userId: string,
      @Param('boardId') boardId: string,
      @Body() dto: SyncBoardDto,
  ) {
      await this.miroService.syncBoardElements(boardId, userId, dto);
      return;
  }

  // =================================================================
  // Board Member Management
  // =================================================================

  @Post(':boardId/members')
  @ApiOperation({ summary: 'Add a member to a board' })
  addMember(
    @GetUserId() currentUserId: string,
    @Param('boardId') boardId: string,
    @Body() dto: AddBoardMemberDto,
  ) {
    return this.miroService.addBoardMember(boardId, currentUserId, dto);
  }

  @Patch(':boardId/members/:targetUserId')
  @ApiOperation({ summary: "Update a board member's role" })
  updateMemberRole(
    @GetUserId() currentUserId: string,
    @Param('boardId') boardId: string,
    @Param('targetUserId') targetUserId: string,
    @Body() dto: UpdateBoardMemberDto,
  ) {
    return this.miroService.updateBoardMember(
      boardId,
      currentUserId,
      targetUserId,
      dto,
    );
  }

  @Delete(':boardId/members/:targetUserId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a member from a board' })
  async removeMember(
    @GetUserId() currentUserId: string,
    @Param('boardId') boardId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    await this.miroService.removeBoardMember(
      boardId,
      currentUserId,
      targetUserId,
    );
    return;
  }
}
