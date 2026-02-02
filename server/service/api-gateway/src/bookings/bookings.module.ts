import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BookingsController } from './bookings.controller';
import { GatewayService } from '../gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [BookingsController],
  providers: [GatewayService],
})
export class BookingsModule {}
