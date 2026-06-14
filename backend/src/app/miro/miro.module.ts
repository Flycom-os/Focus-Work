import { Module } from '@nestjs/common';
import { MiroGateway } from './miro.gateway';
import { MiroService } from './miro.service';

@Module({
  providers: [MiroGateway, MiroService],
})
export class MiroModule {}
