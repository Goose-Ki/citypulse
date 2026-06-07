import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Раздаём фронтенд как статику
  app.useStaticAssets(join(__dirname, '..', '..', 'frontend'));

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-role', 'x-user-id'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Сервер запущен: http://localhost:${port}`);
  console.log(`🌐 Сайт доступен: http://localhost:${port}/index.html`);
}

bootstrap();