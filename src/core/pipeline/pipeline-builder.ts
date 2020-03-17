import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { BrowserProvider } from './browser/browser-provider';
import { PipelineProcess } from './pipeline-process';
import { AbstractBrowser } from './browser/abstract-browser';
import { inject, injectable } from 'inversify';
import { IPipelineBuilder } from './i-pipeline-builder';
import { TYPES as ROOT_TYPES } from './types';
import { Driver } from './driver/driver';
import { PipelineIoc } from './pipeline-ioc';
import { PipelineLogger } from './logger/pipeline-logger';
import { Environment } from './environment';
import { SettingsConfiguration } from './configuration/settings-configuration';

@injectable()
export class PipelineBuilder implements IPipelineBuilder {
	private _pipelineProcess: PipelineProcess;
	private _environment: Environment;
	private _proxies: string[];
	private _pipelineJson: string;

	constructor(
	  @inject(ROOT_TYPES.IPipelineConfigurationBuilder) private _pipelineConfigurationBuilder: IPipelineConfigurationBuilder,
	  @inject(ROOT_TYPES.PipelineLogger) private _logger: PipelineLogger,
	  @inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc,
	  @inject(ROOT_TYPES.AbstractBrowser) private _browser: AbstractBrowser) {
	}

	setEnvironment(value: Environment): PipelineBuilder {
		this._environment = value;
		return this;
	}

	setPipelineJson(pipelineJson: string): PipelineBuilder {
		this._pipelineJson = pipelineJson;
		return this;
	}

	setProxies(proxies: string[]): PipelineBuilder {
		this._proxies = proxies;
		return this;
	}

	async build(): Promise<PipelineProcess> {
		// todo : settings need before this._browser.create
		const pipeline = JSON.parse(this._pipelineJson);
		const settings = pipeline.settings || {window: {}};
		this.setBrowserSettings(settings);
		const driver = await this._browser.create();
		this._ioc
		  .bind<Driver>(ROOT_TYPES.Driver)
		  .toConstantValue(driver);
		this._ioc
		  .bind<Environment>(ROOT_TYPES.Environment)
		  .toConstantValue(this._environment);
		const pipelineConfiguration = this._pipelineConfigurationBuilder
		  .buildFromJson(this._pipelineJson);
		const browserProvider = new BrowserProvider();
		const commands = pipelineConfiguration.commands;
		this._pipelineProcess = new PipelineProcess(commands, browserProvider, this._ioc);
		return this._pipelineProcess;
	}

	private setBrowserSettings(settings: SettingsConfiguration) {
		this._browser.language = settings.window.language;
		this._browser.windowHeight = settings.window.height;
		this._browser.windowWidth = settings.window.width;
		this._browser.proxies = settings.proxies || this._proxies;
	}
}
