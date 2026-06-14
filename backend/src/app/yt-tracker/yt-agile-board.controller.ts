import { Controller, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe, Put } from '@nestjs/common';
import { YtAgileBoardService } from './yt-agile-board.service';
import { CreateYtAgileBoardDto, UpdateYtAgileBoardDto, BoardColumnDto } from '../../dto/yt-agile-board.dto';

@Controller('yt-tracker/boards')
export class YtAgileBoardController {
    constructor(private readonly boardService: YtAgileBoardService) {}

    @Post()
    create(@Body() dto: CreateYtAgileBoardDto) {
        return this.boardService.createBoard(dto);
    }

    @Get(':id')
    get(@Param('id', ParseUUIDPipe) id: string) {
        return this.boardService.getBoard(id);
    }

    @Get('/project/:projectId')
    getForProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.boardService.getBoardsForProject(projectId);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateYtAgileBoardDto) {
        return this.boardService.updateBoard(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.boardService.deleteBoard(id);
    }

    @Put(':id/columns')
    setColumns(@Param('id', ParseUUIDPipe) id: string, @Body() columns: BoardColumnDto[]) {
        return this.boardService.setBoardColumns(id, columns);
    }
}
