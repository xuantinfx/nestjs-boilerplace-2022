import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';

export function setupSwagger(app: INestApplication) {
  const apiPrefix = process.env.API_GLOBAL_PREFIX || '';
  const options = new DocumentBuilder()
    .setTitle('Group Order API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path.join(apiPrefix, 'documentation'), app, document);
}
