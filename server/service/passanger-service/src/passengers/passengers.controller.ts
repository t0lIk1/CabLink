import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengersService.create(createPassengerDto);
  }

  @Get()
  findAll() {
    return this.passengersService.findAll();
  }

  @Get(':userId')
  findOne(@Body() userId: string) {
    return this.passengersService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Body() userId: string,
    @Body() updatePassengerDto: UpdatePassengerDto,
  ) {
    return this.passengersService.update(userId, updatePassengerDto);
  }
}
