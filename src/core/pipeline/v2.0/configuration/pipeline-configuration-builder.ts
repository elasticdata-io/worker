import { IPipelineConfigurationBuilder } from '../../configuration/i-pipeline-configuration-builder';
import { ICommandFactory } from '../../command/i-command-factory';
import { SettingsConfiguration } from '../../configuration/settings-configuration';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';

@injectable()
export class PipelineConfigurationBuilder implements IPipelineConfigurationBuilder {
	private _json: string;

	constructor(@inject(TYPES.ICommandFactory) private _commandFactory: ICommandFactory) {}

	public _commands: any[];
	public _transform: any[];
	public _settings: SettingsConfiguration;
	public _version: string;

	get commands() {
		return this._commands;
	}

	get settings() {
		return this._settings;
	}

	buildFromJson(json: any): IPipelineConfigurationBuilder {
		this._json = json;
		const pipeline = JSON.parse(this._json);
		const commandsJson = JSON.stringify(pipeline.commands || []);
		this._commands = this._commandFactory.createChainCommands(commandsJson);
		this._settings = pipeline.settings || {} as SettingsConfiguration;
		this._version = pipeline.version;
		this.validate();
		return this;
	}

	private validate() {
		if (this._version === '2.0') {
			return;
		}
		throw `version: ${this._version} not supported`;
	}
}
