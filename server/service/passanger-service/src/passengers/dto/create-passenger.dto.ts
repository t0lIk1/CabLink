import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreatePassengerDto {
  @IsString()
  userId: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsPhoneNumber()
  phone: string;
  @IsNumber()
  rating: number;
  @IsEmail()
  email: string;
}
