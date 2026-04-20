import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from '../../../prisma/prisma/prisma.service'
import { TrackerController } from './tracker.controller'
import { TrackerService } from './tracker.service'

@Module({
  imports: [JwtModule.register({})],
  controllers: [TrackerController],
  providers: [TrackerService, PrismaService],
  exports: [TrackerService],
})
export class TrackerModule {}
