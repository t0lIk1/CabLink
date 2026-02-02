import { Injectable } from '@nestjs/common';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { DrizzleService } from 'src/database/database.service';
import { passengers } from 'src/schema';

@Injectable()
export class PassengersService {
  constructor(private drizzle: DrizzleService) {}

  async create(createPassengerDto: CreatePassengerDto) {
    // getuser by id from usersTable

    // user ? contunue : throw error
    const db = this.drizzle.getDb();
    const existingPassenger = await db.query.passengers.findFirst({
      where: { userId: createPassengerDto.userId },
    });

    if (existingPassenger) {
      throw new Error('Passenger already exists');
    }

    return await db.insert(passengers).values(createPassengerDto).returning();
  }
  // findAll() {
  // 	return `This action returns all passengers`;
  // }
  // findOne
  // update
}
