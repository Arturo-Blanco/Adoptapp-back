import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS } from './constants/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  app.enableCors(CORS);
  
  await app.listen(3001);
}
bootstrap();
