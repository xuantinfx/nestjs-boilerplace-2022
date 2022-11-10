import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/exceptions/filters/all-exceptions.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const origins = process.env.CORS_ALLOWED_ORIGINS || /^(.*)/;
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [origins],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.setGlobalPrefix(process.env.API_GLOBAL_PREFIX || '');

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = +process.env.API_PORT || 3000;
  await app.listen(port);
}

bootstrap();
