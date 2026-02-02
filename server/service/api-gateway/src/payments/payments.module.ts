import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentsController } from './payments.controller';
import { GatewayService } from '../gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [GatewayService],
})
export class PaymentsModule {}
