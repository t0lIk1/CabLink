import { Module } from '@nestjs/common';
import { DrizzleService } from './database.service';

@Module({
  exports: [DrizzleService],
  providers: [DrizzleService],
})
export class DrizzleModule {}
