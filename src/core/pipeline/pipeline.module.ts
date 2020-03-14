import { Module } from '@nestjs/common';
import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { PipelineConfigurationBuilder } from './v2.0/configuration/pipeline-configuration-builder';
import { IPipelineLogger } from './log/i-pipeline-logger';
import { PipelineLogger } from './log/pipeline-logger';
import { ICommandFactory } from './command/i-command-factory';
import { CommandFactory } from './v2.0/command/command-factory';
import { PipelineBuilder } from './pipeline-builder';
import { IBrowserProvider } from './browser/i-browser-provider';
import { BrowserProvider } from './browser/browser-provider';
import { AbstractBrowser } from './browser/abstract-browser';
import { Chromium } from './browser/provider/chromium';

@Module({
  imports: [],
  providers: [
    {
      provide: IPipelineConfigurationBuilder,
      useClass: PipelineConfigurationBuilder,
    },
    {
      provide: IBrowserProvider,
      useClass: BrowserProvider,
    },
    {
      provide: IPipelineLogger,
      useClass: PipelineLogger,
    },
    {
      provide: ICommandFactory,
      useClass: CommandFactory,
    },
    {
      provide: AbstractBrowser,
      useClass: Chromium,
    },
    PipelineBuilder,
  ],
  exports: [PipelineBuilder]
})
export class PipelineModule {}
