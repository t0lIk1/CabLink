import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

interface TokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly SALT_ROUNDS = 10;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    role: 'DRIVER' | 'PASSENGER',
  ) {
    const createUserDto: CreateUserDto = { email, password, name, role };
    const user = await this.usersService.create(createUserDto);

    const { accessToken, refreshToken } = await this.generateTokenPair(
      user.id,
      user.email,
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(
      user.id,
      user.email,
    );

    return { accessToken, refreshToken };
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
        break;
      }
    }
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

    await this.prisma.refreshToken.update({
      where: { id: matchedToken.id },
      data: { revoked: true },
    });

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokenPair(
        matchedToken.userId,
        matchedToken.user.email,
      );

    return { accessToken, refreshToken: newRefreshToken };
  }
  private async generateTokenPair(userId: string, email: string) {
    const accessToken = this.jwt.sign({ sub: userId, email } as TokenPayload);
    const refreshToken = randomUUID();
    const tokenHash = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY),
      },
    });

    return { accessToken, refreshToken };
  }
}
