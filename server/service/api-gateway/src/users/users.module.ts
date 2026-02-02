import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { GatewayService } from '../gateway.service';

@Module({
  controllers: [UsersController],
  providers: [GatewayService],
})
export class UsersModule {}
