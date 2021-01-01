import { Module } from '@nestjs/common';
import { DataStoreController } from './data-store.controller';
import { DataStoreService } from './data-store.service';
import configuration from "./config";
import { ConfigModule } from '@nestjs/config';
import {DataRuleService} from "./rule/data-rule.service";
import RuleCommandFactory from "./rule/rule-command.factory";
import {DynamicLinkService} from "./dynamic-link-service";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration] ,
    }),
  ],
  controllers: [DataStoreController],
  providers: [
    DynamicLinkService,
    DataStoreService,
    DataRuleService,
    RuleCommandFactory,
  ],
})
export class DataStoreModule {}
