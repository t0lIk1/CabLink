import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DrizzleService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { refreshTokens } from '../schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { UserRole } from '../schema';

interface TokenPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly SALT_ROUNDS = 10;

  constructor(
    private drizzle: DrizzleService,
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

  async register(email: string, password: string, role: UserRole) {
    const createUserDto: CreateUserDto = { email, password, role };
    const user = await this.usersService.create(createUserDto);

    const { accessToken, refreshToken } = await this.generateTokenPair(
      user.id,
      user.email,
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email },
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
    const db = this.drizzle.getDb();
    const tokens = await db.query.refreshTokens.findMany({
      where: eq(refreshTokens.revoked, false),
    });

    let found = false;
    for (const t of tokens) {
      if (await bcrypt.compare(refreshToken, t.tokenHash)) {
        await db
          .update(refreshTokens)
          .set({ revoked: true })
          .where(eq(refreshTokens.id, t.id));
        found = true;
        break;
      }
    }

    if (!found) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { success: true };
  }

  async refresh(refreshToken: string) {
    const db = this.drizzle.getDb();
    const tokens = await db.query.refreshTokens.findMany({
      where: eq(refreshTokens.revoked, false),
      with: {
        user: true,
      },
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

    await db
      .update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.id, matchedToken.id));

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokenPair(
        matchedToken.userId,
        matchedToken.user.email,
      );

    return { accessToken, refreshToken: newRefreshToken };
  }

  private async generateTokenPair(userId: string, email: string) {
    const db = this.drizzle.getDb();
    const accessToken = this.jwt.sign({ sub: userId, email } as TokenPayload);
    const refreshTokenValue = randomUUID();
    const tokenHash = await bcrypt.hash(refreshTokenValue, this.SALT_ROUNDS);

    await db.insert(refreshTokens).values({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRY),
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }
}
