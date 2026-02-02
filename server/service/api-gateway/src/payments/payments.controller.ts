import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { GatewayService } from '../gateway.service';

@Controller('api/payments')
export class PaymentsController {
  constructor(private gateway: GatewayService) {}

  /**
   * Инициировать платеж: POST /api/payments/process
   */
  @Post('process')
  @HttpCode(200)
  async processPayment(
    @Body() body: { bookingId: string; amount: number },
    @Headers() headers: any,
  ) {
    return this.gateway.forwardRequest(
      '/payments/process',
      'POST',
      body,
      headers,
    );
  }

  /**
   * Получить историю платежей: POST /api/payments/history
   */
  @Post('history')
  @HttpCode(200)
  async getPaymentHistory(
    @Body() body: { userId: string },
    @Headers() headers: any,
  ) {
    return this.gateway.forwardRequest(
      '/payments/history',
      'POST',
      body,
      headers,
    );
  }
}
