import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../schema';

/**
 * @example
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('ADMIN', 'SUPPORT')
 * @Get('admin-panel')
 * getAdminPanel() { }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
