import { Controller, Post, Body, HttpCode, Res, Req } from '@nestjs/common';
import { GatewayService } from '../gateway.service';
import type { Response, Request } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private gateway: GatewayService) {}

  /**
   * Авторизация: POST /api/auth/login
   */
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.gateway.forwardRequest('/auth/login', 'POST', body, {}, res);
  }

  /**
   * Регистрация: POST /api/auth/register
   */
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() body: { email: string; password: string; name?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.gateway.forwardRequest('/auth/register', 'POST', body, {}, res);
  }

  /**
   * Обновление токена: POST /api/auth/refresh
   */
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = (req.cookies as Record<string, string>).refreshToken;
    const headers: Record<string, string> = {};
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }
    return this.gateway.forwardRequest(
      '/auth/refresh',
      'POST',
      { refreshToken },
      headers,
      res,
    );
  }

  /**
   * Выход: POST /api/auth/logout
   */
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = (req.cookies as Record<string, string>).refreshToken;
    const headers: Record<string, string> = {};
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }
    const result = await this.gateway.forwardRequest(
      '/auth/logout',
      'POST',
      { refreshToken },
      headers,
      res,
    );

    res.clearCookie('refreshToken');

    return result;
  }

  @Get
}
