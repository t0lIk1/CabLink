import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GatewayService } from '../gateway.service';

@Module({
  controllers: [AuthController],
  providers: [GatewayService],
})
export class AuthModule {}
