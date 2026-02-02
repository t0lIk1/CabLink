import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { GatewayService } from '../gateway.service';

@Module({
  controllers: [PaymentsController],
  providers: [GatewayService],
})
export class PaymentsModule {}
