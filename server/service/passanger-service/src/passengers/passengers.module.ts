import { Module } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';
import { DrizzleModule } from 'src/database/database.module';

@Module({
  imports: [DrizzleModule],
  providers: [PassengersService],
  controllers: [PassengersController],
})
export class PassengersModule {}
