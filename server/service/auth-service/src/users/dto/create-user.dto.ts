// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { USER_ROLES } from '../../schema'; // ← обычный импорт (это значение — массив)
import type { UserRole } from '../../schema'; // ← type-only импорт (только тип)

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(USER_ROLES)
  role: UserRole;
}
