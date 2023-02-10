#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataStoreModule } from './data-store/data-store.module';

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

  await app.listen(port, '127.0.0.1');
  console.debug(`Application stated on ${port} port...`);

  process.on('uncaughtException', function (err) {
    console.error(err);
  });
}
async function bootstrapDataStore() {
  const app = await NestFactory.create(DataStoreModule, {
    logger: ['error', 'warn'],
  });
  const port = 3001;

  await app.listen(port, '127.0.0.1');
  console.debug(`Application stated on ${port} port...`);

  process.on('uncaughtException', function (err) {
    console.error(err);
  });
}
bootstrap();
bootstrapDataStore();
