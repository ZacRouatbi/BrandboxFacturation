import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.use(cookieParser());
  if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}
}
bootstrap();
