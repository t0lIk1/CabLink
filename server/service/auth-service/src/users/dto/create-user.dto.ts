import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../generated/prisma/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
