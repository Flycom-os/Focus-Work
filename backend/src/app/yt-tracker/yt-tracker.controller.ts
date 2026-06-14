import { Controller, Post, Body, Get, Param, Patch, Delete, ParseUUIDPipe, Query, Req } from '@nestjs/common';
import { YtTrackerService } from './yt-tracker.service';
import { CreateYtIssueDto, UpdateYtIssueDto } from '../../dto/yt-issue.dto';

@Controller('yt-tracker/issues')
export class YtTrackerController {
  constructor(private readonly ytTrackerService: YtTrackerService) {}

  @Post()
  create(@Body() createYtIssueDto: CreateYtIssueDto) {
    return this.ytTrackerService.create(createYtIssueDto);
  }

  @Get('search')
  search(@Query('q') query: string, @Req() req: any) { // NOTE: Assumes userId is on req.user.id, which depends on the auth implementation.
      const userId = req.user?.id;
      if (!userId) {
        // Or handle unauthorized access appropriately
        return this.ytTrackerService.findByQuery(query, '');
      }
      return this.ytTrackerService.findByQuery(query, userId);
  }

  @Get()
  findAll() {
    return this.ytTrackerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ytTrackerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateYtIssueDto: UpdateYtIssueDto) {
    return this.ytTrackerService.update(id, updateYtIssueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ytTrackerService.remove(id);
  }
}
