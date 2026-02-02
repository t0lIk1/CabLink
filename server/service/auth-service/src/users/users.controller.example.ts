import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  /**
   * Только администраторы могут получить список всех пользователей
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPPORT')
  async getAllUsers() {
    return this.users.findAll();
  }

  /**
   * Только водители и администраторы могут получить статистику
   */
  @Get('statistics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DRIVER', 'ADMIN')
  async getStatistics() {
    return this.users.getStatistics();
  }

  /**
   * Любой авторизованный пользователь может получить свой профиль
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {
    return { message: 'Profile data' };
  }
}
