import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { GatewayService } from '../gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [GatewayService],
})
export class AuthModule {}
