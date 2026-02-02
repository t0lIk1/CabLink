import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { GatewayService } from '../gateway.service';

@Module({
  controllers: [BookingsController],
  providers: [GatewayService],
})
export class BookingsModule {}
