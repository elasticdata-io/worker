#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();

  // const app = await NestFactory.create(AppModule, {
  //   logger: ['error', 'warn'],
  // });
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  const options = new DocumentBuilder()
    .setTitle('Worker API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }));

  await app.listen(port, '127.0.0.1');
  console.debug(`Application stated on ${port} port...`);

  http.createServer(server).listen(port);
  http.createServer(server).listen(80);
}
bootstrap();
