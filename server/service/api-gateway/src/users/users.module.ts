import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { GatewayService } from '../gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [GatewayService],
})
export class UsersModule {}
