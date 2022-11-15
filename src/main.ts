import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SerializerInterceptor } from './utils/serializer.interceptor';
import validationOptions from './utils/validation-options';
import { AllExceptionsFilter } from './shared/exceptions/filters/all-exceptions.filter';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const origins = process.env.CORS_ALLOWED_ORIGINS || /^(.*)/;
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();

  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: [origins],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.setGlobalPrefix(configService.get('app.apiPrefix'), {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  setupSwagger(app);

  await app.listen(configService.get('app.port'));
}
void bootstrap();
