import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health check / Root
   */
  @Get('health')
  getHealth(): object {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /**
   * Root endpoint
   */
  @Get()
  getRoot(): object {
    return {
      message: 'CabLink API Gateway',
      version: '1.0.0',
      status: 'running',
    };
  }
}
