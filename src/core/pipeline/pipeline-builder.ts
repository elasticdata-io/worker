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
import { SettingsConfiguration, UserInteractionSettingsConfiguration } from './configuration/settings-configuration';
import {UserInteractionInspector} from "./user-interaction/user-interaction-inspector";
import {SettingsWindowConfiguration} from "./configuration/settings-window-configuration";

@injectable()
export class PipelineBuilder implements IPipelineBuilder {
	private _pipelineProcess: PipelineProcess;
	private _environment: Environment;
	private _proxies: string[];
	private _userInteraction: UserInteractionSettingsConfiguration;
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
		const settings = (pipeline.settings || {window: {}}) as SettingsConfiguration;
		this._setBrowserSettings(settings);
		this._setUserInteraction(settings.userInteraction);
		const driver = await this._browser.create();
		this._ioc
		  .bind<Driver>(ROOT_TYPES.Driver)
		  .toConstantValue(driver);
		this._ioc
		  .bind<Environment>(ROOT_TYPES.Environment)
		  .toConstantValue(this._environment);
		try {
			const pipelineConfiguration = this._pipelineConfigurationBuilder
			  .buildFromJson(this._pipelineJson);
			const browserProvider = new BrowserProvider(this._ioc);
			const commands = pipelineConfiguration.commands;
			const commandsJson = pipelineConfiguration.commandsJson;
			const dataRules = pipelineConfiguration.dataRules;
			this._pipelineProcess = new PipelineProcess(commandsJson, commands, dataRules, browserProvider, this._ioc);
			return this._pipelineProcess;
		} catch (e) {
			throw e;
		}
	}

	private _setBrowserSettings(settings: SettingsConfiguration) {
		const window = settings.window || {} as SettingsWindowConfiguration;
		this._browser.language = window.language || this._browser.language;
		this._browser.windowHeight = window.height || this._browser.windowHeight;
		this._browser.windowWidth = window.width || this._browser.windowWidth;
		this._browser.proxies = settings.proxies || this._proxies;
	}

	private _setUserInteraction(userInteraction: UserInteractionSettingsConfiguration) {
		if (!userInteraction) {
			return;
		}
		const userInteractionInspector = this._ioc.get<UserInteractionInspector>(ROOT_TYPES.UserInteractionInspector);
		userInteractionInspector.userInteraction = userInteraction;
	}
}
