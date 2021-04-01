import { Module } from '@nestjs/common';
import { DataStoreController } from './data-store.controller';
import { DataStoreService } from './data-store.service';
import configuration from "./config";
import { ConfigModule } from '@nestjs/config';
import {DataRuleService} from "./rule/data-rule.service";
import RuleCommandFactory from "./rule/rule-command.factory";
import {DynamicLinkService} from "./dynamic-link-service";
import { StorageService } from './storage-service';
import { AbstractFileClientService } from './abstract-file-client.service';
import { MinioFileClientService } from './minio-file-client.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration] ,
    }),
    EnvModule,
  ],
  controllers: [DataStoreController],
  providers: [
    DynamicLinkService,
    DataStoreService,
    DataRuleService,
    RuleCommandFactory,
    StorageService,
    {
      provide: AbstractFileClientService,
      useClass: MinioFileClientService,
    },
  ],
})
export class DataStoreModule {}
