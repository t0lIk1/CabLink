import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../schema';

/**
 * Декоратор для установки требуемых ролей для route/controller
 * Используется совместно с RolesGuard
 *
 * @example
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('ADMIN', 'SUPPORT')
 * @Get('admin-panel')
 * getAdminPanel() { }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
