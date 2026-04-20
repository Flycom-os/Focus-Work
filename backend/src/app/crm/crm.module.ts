import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from '../../../prisma/prisma/prisma.service'
import { CrmController } from './crm.controller'
import { CrmService } from './crm.service'

@Module({
  imports: [JwtModule.register({})],
  controllers: [CrmController],
  providers: [CrmService, PrismaService],
  exports: [CrmService],
})
export class CrmModule {}
