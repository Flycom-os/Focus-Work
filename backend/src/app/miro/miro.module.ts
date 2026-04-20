import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from '../../../prisma/prisma/prisma.service'
import { MiroController } from './miro.controller'
import { MiroService } from './miro.service'

@Module({
  imports: [JwtModule.register({})],
  controllers: [MiroController],
  providers: [MiroService, PrismaService],
  exports: [MiroService],
})
export class MiroModule {}

