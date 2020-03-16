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
import { Environment } from './environment';
import { SettingsConfiguration } from './configuration/settings-configuration';

@injectable()
export class PipelineBuilder implements IPipelineBuilder {
	private _pipelineProcess: PipelineProcess;

	constructor(
	  @inject(TYPES.IPipelineConfigurationBuilder) private _pipelineConfigurationBuilder: IPipelineConfigurationBuilder,
	  @inject(TYPES.PipelineLogger) private _logger: PipelineLogger,
	  @inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc,
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
		const pipelineConfiguration = this._pipelineConfigurationBuilder
		  .setJson(this._pipelineJson);
		const settings = pipelineConfiguration.buildSettings();
		this.setBrowserSettings(settings);
		const driver = await this._browser.create();
		await driver.init();
		this._ioc
		  .bind<Driver>(TYPES.Driver)
		  .toConstantValue(driver);
		this._ioc
		  .bind<Environment>(TYPES.Environment)
		  .toConstantValue(this._environment);
		const browserProvider = new BrowserProvider();
		const commands = pipelineConfiguration.buildCommands();
		this._pipelineProcess = new PipelineProcess(commands, browserProvider, this._ioc);
		return this._pipelineProcess;
	}

	private setBrowserSettings(settings: SettingsConfiguration) {
		this._browser.language = settings.window.language;
		this._browser.windowHeight = settings.window.height;
		this._browser.windowWidth = settings.window.width;
	}
}
