import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const accessToken = this.jwt.sign({ sub: user.id });
    const refreshToken = randomUUID();
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    const refreshToken = randomUUID();
    const tokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { revoked: false },
      include: { user: true },
    });

    let matchedToken: (typeof tokens)[0] | null = null;
    for (const t of tokens) {
      if (await bcrypt.compare(refreshToken, t.tokenHash)) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (matchedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // revoke old
    await this.prisma.refreshToken.update({
      where: { id: matchedToken.id },
      data: { revoked: true },
    });

    // issue new
    const newRefresh = randomUUID();
    const newHash = await bcrypt.hash(newRefresh, 10);

    await this.prisma.refreshToken.create({
      data: {
        userId: matchedToken.userId,
        tokenHash: newHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const accessToken = this.jwt.sign({ sub: matchedToken.userId });

    return { accessToken, refreshToken: newRefresh };
  }

  async logout(refreshToken: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { revoked: false },
    });

    for (const t of tokens) {
      if (await bcrypt.compare(refreshToken, t.tokenHash)) {
        await this.prisma.refreshToken.update({
          where: { id: t.id },
          data: { revoked: true },
        });
      }
    }
  }
}
