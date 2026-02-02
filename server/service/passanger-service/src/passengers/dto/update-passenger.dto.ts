import { CreatePassengerDto } from './create-passenger.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePassengerDto extends PartialType(CreatePassengerDto) {}
