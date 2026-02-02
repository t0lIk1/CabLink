import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleService } from './database.service';

describe('DrizzleService', () => {
  let service: DrizzleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrizzleService],
    }).compile();

    service = module.get<DrizzleService>(DrizzleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
