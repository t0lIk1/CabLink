// auth/auth.controller.ts
import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from './dtos';
import type { Response, Request } from 'express';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.auth.register(
      dto.email,
      dto.password,
      dto.name,
      dto.role,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken, user };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.auth.login(
      dto.email,
      dto.password,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(
    @Body() body: { refreshToken?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      body.refreshToken || (req.cookies as Record<string, string>).refreshToken;
    const tokens = await this.auth.refresh(refreshToken);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Body() body: { refreshToken?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      body.refreshToken || (req.cookies as Record<string, string>).refreshToken;
    await this.auth.logout(refreshToken);

    res.clearCookie('refreshToken');

    return { success: true };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  }
}
