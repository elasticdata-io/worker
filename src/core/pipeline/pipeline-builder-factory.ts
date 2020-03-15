import { Container } from 'inversify';
import { ICommandFactory } from './command/i-command-factory';
import { TYPES } from './types';
import { CommandFactory } from './v2.0/command/command-factory';
import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { PipelineConfigurationBuilder } from './v2.0/configuration/pipeline-configuration-builder';
import { IPipelineBuilder } from './i-pipeline-builder';
import { PipelineBuilder } from './pipeline-builder';
import { PipelineLogger } from './logger/pipeline-logger';
import { AbstractBrowser } from './browser/abstract-browser';
import { ChromiumPuppeteer } from './browser/provider/chromium-puppeteer';
import { PipelineIoc } from './pipeline-ioc';
import { QueryProviderFactory } from './query/query-provider-factory';
import { BrowserProvider } from './browser/browser-provider';
import { IBrowserProvider } from './browser/i-browser-provider';

export class PipelineBuilderFactory {

	public async resolve(): Promise<IPipelineBuilder> {
		const ioc = new Container();
		ioc
		  .bind<ICommandFactory>(TYPES.ICommandFactory)
		  .to(CommandFactory);
		ioc
		  .bind<IPipelineConfigurationBuilder>(TYPES.IPipelineConfigurationBuilder)
		  .to(PipelineConfigurationBuilder);
		ioc
		  .bind<IPipelineBuilder>(TYPES.IPipelineBuilder)
		  .to(PipelineBuilder);
		ioc
		  .bind<PipelineLogger>(TYPES.PipelineLogger)
		  .to(PipelineLogger);
		ioc
		  .bind<AbstractBrowser>(TYPES.AbstractBrowser)
		  .to(ChromiumPuppeteer);
		ioc
		  .bind<IBrowserProvider>(TYPES.IBrowserProvider)
		  .to(BrowserProvider);
		ioc
		  .bind<QueryProviderFactory>(TYPES.QueryProviderFactory)
		  .to(QueryProviderFactory);
		ioc
		  .bind<PipelineIoc>(TYPES.PipelineIoc)
		  .toConstantValue(ioc);
		return ioc.get<IPipelineBuilder>(TYPES.IPipelineBuilder);
	}
}
