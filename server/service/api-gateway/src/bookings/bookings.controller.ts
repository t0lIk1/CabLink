import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { GatewayService } from '../gateway.service';

@Controller('api/bookings')
export class BookingsController {
  constructor(private gateway: GatewayService) {}

  /**
   * Создать новый заказ: POST /api/bookings
   */
  @Post()
  @HttpCode(201)
  async createBooking(
    @Body()
    body: {
      passengerId: string;
      pickupLocation: string;
      dropoffLocation: string;
    },
    @Headers() headers: any,
  ) {
    return this.gateway.forwardRequest('/bookings', 'POST', body, headers);
  }

  /**
   * Получить заказ по ID: GET /api/bookings/:id
   */
  @Get(':id')
  async getBooking(@Param('id') id: string, @Headers() headers: any) {
    return this.gateway.forwardRequest(`/bookings/${id}`, 'GET', null, headers);
  }

  /**
   * Получить все заказы пользователя: GET /api/bookings/user/:userId
   */
  @Get('user/:userId')
  async getUserBookings(
    @Param('userId') userId: string,
    @Headers() headers: any,
  ) {
    return this.gateway.forwardRequest(
      `/bookings/user/${userId}`,
      'GET',
      null,
      headers,
    );
  }
}
