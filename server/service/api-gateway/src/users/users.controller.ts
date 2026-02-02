import { Controller, Get, Headers } from '@nestjs/common';
import { GatewayService } from '../gateway.service';

@Controller('api/users')
export class UsersController {
  constructor(private gateway: GatewayService) {}

  /**
   * Получение профиля: GET /api/users/profile
   */
  @Get('profile')
  async getProfile(@Headers() headers: any) {
    return this.gateway.forwardRequest('/users/profile', 'GET', null, headers);
  }
}
