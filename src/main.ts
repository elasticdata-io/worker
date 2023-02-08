#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  const options = new DocumentBuilder()
    .setTitle('Worker API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json({ limit: '50mb' }));
  app.enableCors();

  await app.listen(port, '0.0.0.0');
  console.debug(`Application stated on ${port} port...`);
}
bootstrap();
