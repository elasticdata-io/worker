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
import { HttpDataStore } from './data/provider/http-data-store';
import { AbstractStore } from './data/abstract-store';
import { DataContextResolver } from './data/data-context-resolver';
import { HttpDataClient } from './data/provider/http.data.client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JsonCommandAnalyzer } from './analyzer/provider/json.command.analyzer';
import { AbstractCommandAnalyzer } from './analyzer/abstract.command.analyzer';
import { CssQueryProvider } from './query/css/css-query-provider';
import { XpathQueryProvider } from './query/xpath/xpath-query-provider';
import { CssLoopSelection } from './query/css/css-loop-selection';
import { XpathLoopSelection } from './query/xpath/xpath-loop-selection';
import {PageContextResolver} from "./browser/page-context-resolver";

@Injectable()
export class PipelineBuilderFactory {

	constructor(private configService: ConfigService) {}

	public async resolve(): Promise<IPipelineBuilder> {
		const dataServiceUrl = this.configService.get<string>('DATA_SERVICE_URL');
		const ioc = new Container();
		ioc
		  .bind<ICommandFactory>(TYPES.ICommandFactory)
		  .to(CommandFactory)
		  .inSingletonScope();
		ioc
		  .bind<IPipelineConfigurationBuilder>(TYPES.IPipelineConfigurationBuilder)
		  .to(PipelineConfigurationBuilder)
		  .inSingletonScope();
		ioc
		  .bind<IPipelineBuilder>(TYPES.IPipelineBuilder)
		  .to(PipelineBuilder)
		  .inSingletonScope();
		ioc
		  .bind<PipelineLogger>(TYPES.PipelineLogger)
		  .to(PipelineLogger)
		  .inSingletonScope();
		ioc
		  .bind<AbstractBrowser>(TYPES.AbstractBrowser)
		  .to(ChromiumPuppeteer)
		  .inSingletonScope();
		ioc
		  .bind<IBrowserProvider>(TYPES.IBrowserProvider)
		  .to(BrowserProvider)
		  .inSingletonScope();
		ioc
		  .bind<XpathQueryProvider>(TYPES.XpathQueryProvider)
		  .to(XpathQueryProvider)
		  .inSingletonScope();
		ioc
		  .bind<CssLoopSelection>(TYPES.CssLoopSelection)
		  .to(CssLoopSelection)
		  .inSingletonScope();
		ioc
		  .bind<XpathLoopSelection>(TYPES.XpathLoopSelection)
		  .to(XpathLoopSelection)
		  .inSingletonScope();
		ioc
		  .bind<CssQueryProvider>(TYPES.CssQueryProvider)
		  .to(CssQueryProvider)
		  .inSingletonScope();
		ioc
		  .bind<QueryProviderFactory>(TYPES.QueryProviderFactory)
		  .to(QueryProviderFactory)
		  .inSingletonScope();
		ioc
		  .bind<DataContextResolver>(TYPES.DataContextResolver)
		  .to(DataContextResolver)
		  .inSingletonScope();
		ioc
		  .bind<PageContextResolver>(TYPES.PageContextResolver)
		  .to(PageContextResolver)
		  .inSingletonScope();
		ioc
		  .bind<AbstractStore>(TYPES.AbstractStore)
		  .to(HttpDataStore)
		  .inSingletonScope();
		ioc
		  .bind<HttpDataClient>(TYPES.HttpDataClient)
		  .to(HttpDataClient)
		  .inSingletonScope();
		ioc
		  .bind<AbstractCommandAnalyzer>(TYPES.AbstractCommandAnalyzer)
		  .to(JsonCommandAnalyzer)
		  .inSingletonScope();
		ioc
		  .bind<string>(TYPES.DataServiceUrl)
		  .toConstantValue(dataServiceUrl);
		ioc
		  .bind<PipelineIoc>(TYPES.PipelineIoc)
		  .toConstantValue(ioc);
		return ioc.get<IPipelineBuilder>(TYPES.IPipelineBuilder);
	}
}
