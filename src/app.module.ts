import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PipelineModule } from './pipeline/pipeline.module';
import { AppConsumer } from './app.consumer';
import { DocumentationModule } from './documentation/documentation.module';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AliveModule } from './alive/alive.module';
import { EnvModule } from './env/env.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './data-store/config';
import { DataStoreModule } from './data-store/data-store.module';
import { OrmPersistenceModule } from './persistence';
import { TaskModule } from './task';

@Module({
  imports: [
    OrmPersistenceModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
    }),
    PipelineModule,
    TaskModule,
    DocumentationModule,
    EnvModule,
    AliveModule,
    DataStoreModule,
  ],
  controllers: [],
  providers: [AppService, AppConsumer],
})
export class AppModule {}
