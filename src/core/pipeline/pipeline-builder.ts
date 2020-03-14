import { Environment } from './Environment';
import { ModuleRef } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { IPipelineLogger } from './log/i-pipeline-logger';
import { BrowserProvider } from './browser/browser-provider';
import { PipelineProcess } from './pipeline-process';
import { AbstractBrowser } from './browser/abstract-browser';

@Injectable()
export class PipelineBuilder {
	private _pipelineProcess: PipelineProcess;

	constructor(private _pipelineConfiguration: IPipelineConfigurationBuilder,
				private _logger: IPipelineLogger,
				private _browser: AbstractBrowser,
				private _moduleRef: ModuleRef) {
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

	build(): PipelineProcess {
		const browserProvider = new BrowserProvider();
		const pipelineConfiguration = this._pipelineConfiguration
		  .setJson(this._pipelineJson);
		const commands = pipelineConfiguration.buildCommands();
		this._pipelineProcess = new PipelineProcess(this._browser, commands, browserProvider);
		return this._pipelineProcess;
	}
}
