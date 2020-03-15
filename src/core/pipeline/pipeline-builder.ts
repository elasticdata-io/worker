import { Environment } from './Environment';
import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { BrowserProvider } from './browser/browser-provider';
import { PipelineProcess } from './pipeline-process';
import { AbstractBrowser } from './browser/abstract-browser';
import { inject, injectable } from 'inversify';
import { IPipelineBuilder } from './i-pipeline-builder';
import { TYPES as ROOT_TYPES, TYPES } from './types';
import { Driver } from './driver/driver';
import { PipelineIoc } from './pipeline-ioc';
import { PipelineLogger } from './logger/pipeline-logger';

@injectable()
export class PipelineBuilder implements IPipelineBuilder {
	private _pipelineProcess: PipelineProcess;

	constructor(
	  @inject(TYPES.IPipelineConfigurationBuilder) private _pipelineConfigurationBuilder: IPipelineConfigurationBuilder,
	  @inject(TYPES.PipelineLogger) private _logger: PipelineLogger,
	  @inject(ROOT_TYPES.PipelineIoc) private _pipelineIoc: PipelineIoc,
	  @inject(TYPES.AbstractBrowser) private _browser: AbstractBrowser) {
	}

	setEnvironment(value: Environment): PipelineBuilder {
		this._environment = value;
		return this;
	}

	private _environment: Environment;

	setPipelineJson(pipelineJson: any): PipelineBuilder {
		this._pipelineJson = pipelineJson;
		return this;
	}

	private _pipelineJson: any;

	async build(): Promise<PipelineProcess> {
		const driver = await this._browser.create();
		await driver.init();
		this._pipelineIoc
		  .bind<Driver>(TYPES.Driver)
		  .toConstantValue(driver);
		const browserProvider = new BrowserProvider();
		const pipelineConfiguration = this._pipelineConfigurationBuilder
		  .setJson(this._pipelineJson);
		const commands = pipelineConfiguration.buildCommands();
		this._pipelineProcess = new PipelineProcess(commands, browserProvider, this._pipelineIoc);
		return this._pipelineProcess;
	}
}
