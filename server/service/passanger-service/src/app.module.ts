import { Module } from '@nestjs/common';
import { PassengersModule } from './passengers/passengers.module';
import { DrizzleModule } from './database/database.module';

@Module({
  imports: [PassengersModule, DrizzleModule],
})
export class AppModule {}
