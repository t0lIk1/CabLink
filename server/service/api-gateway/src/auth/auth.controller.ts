import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { GatewayService } from '../gateway.service';

@Controller('api/auth')
export class AuthController {
  constructor(private gateway: GatewayService) {}

  /**
   * Авторизация: POST /api/auth/login
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    return this.gateway.forwardRequest('/auth/login', 'POST', body);
  }

  /**
   * Регистрация: POST /api/auth/register
   */
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() body: { email: string; password: string; name?: string },
  ) {
    return this.gateway.forwardRequest('/auth/register', 'POST', body);
  }

  /**
   * Обновление токена: POST /api/auth/refresh
   */
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.gateway.forwardRequest('/auth/refresh', 'POST', body);
  }

  /**
   * Выход: POST /api/auth/logout
   */
  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: { refreshToken: string }) {
    return this.gateway.forwardRequest('/auth/logout', 'POST', body);
  }
}
