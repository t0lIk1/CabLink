import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Log environment variables
  console.log('=== Environment Configuration ===');
  console.log(`PORT: ${process.env.PORT ?? 3000}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`);
  console.log('=================================');

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`✅ Application started on port ${port}`);
}
bootstrap();
