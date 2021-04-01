import { Module } from '@nestjs/common';
import { DataStoreController } from './data-store.controller';
import { DataStoreService } from './data-store.service';
import configuration from "./config";
import { ConfigModule } from '@nestjs/config';
import {DataRuleService} from "./rule/data-rule.service";
import RuleCommandFactory from "./rule/rule-command.factory";
import {PersistenceLinkService} from "./persistence-link.service";
import { StorageService } from './storage-service';
import { AbstractFileClientService } from './abstract-file-client.service';
import { MinioFileClientService } from './minio-file-client.service';
import { EnvModule } from '../env/env.module';
import { AbstractDynamicLinkService } from './abstract-dynamic-link.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration] ,
    }),
    EnvModule,
  ],
  controllers: [DataStoreController],
  providers: [
    PersistenceLinkService,
    DataStoreService,
    DataRuleService,
    RuleCommandFactory,
    StorageService,
    {
      provide: AbstractFileClientService,
      useClass: MinioFileClientService,
    },
    {
      provide: AbstractDynamicLinkService,
      useClass: PersistenceLinkService,
    },
  ],
})
export class DataStoreModule {}
