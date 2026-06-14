import { Module } from '@nestjs/common';
import { YtTrackerController } from './yt-tracker.controller';
import { YtTrackerService } from './yt-tracker.service';
import { PrismaService } from '../../../prisma/prisma/prisma.service';
import { YtCustomFieldController } from './yt-custom-field.controller';
import { YtCustomFieldService } from './yt-custom-field.service';
import { YtAgileBoardController } from './yt-agile-board.controller';
import { YtAgileBoardService } from './yt-agile-board.service';

@Module({
  controllers: [YtTrackerController, YtCustomFieldController, YtAgileBoardController],
  providers: [YtTrackerService, YtCustomFieldService, YtAgileBoardService, PrismaService],
})
export class YtTrackerModule {}
