import { IPipelineConfigurationBuilder } from '../../configuration/i-pipeline-configuration-builder';
import { ICommandFactory } from '../../command/i-command-factory';
import { SettingsConfiguration } from '../../configuration/settings-configuration';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataRule } from '../../data/dto/data-rule';

@injectable()
export class PipelineConfigurationBuilder implements IPipelineConfigurationBuilder {
	private _json: string;
	private readonly SUPPORTING_VERSIONS = ['2.0'];

	constructor(@inject(TYPES.ICommandFactory) private _commandFactory: ICommandFactory) {}

	public _commandsJson: string;
	public _commands: any[];
	public _dataRules: Array<DataRule>;
	public _settings: SettingsConfiguration;
	public _version: string;

	get commands(): any[] {
		return this._commands;
	}

	get commandsJson(): string {
		return this._commandsJson;
	}

	get settings(): SettingsConfiguration {
		return this._settings;
	}

	get dataRules(): Array<DataRule> {
		return this._dataRules;
	}

	buildFromJson(json: any): IPipelineConfigurationBuilder {
		this._json = json;
		const pipeline = JSON.parse(this._json);
		const commandsJson = JSON.stringify(pipeline.commands || []);
		this._commandsJson = this._commandFactory.appendUuidToCommands(commandsJson);
		this._commands = this._commandFactory.createChainCommands(this._commandsJson);
		this._settings = pipeline.settings || {} as SettingsConfiguration;
		this._dataRules = pipeline.dataRules;
		this._version = pipeline.version;
		this.validate();
		return this;
	}

	private validate() {
		if (!this.SUPPORTING_VERSIONS.includes(this._version)) {
			throw new Error(`version "${this._version}" not supported`);
		}
		if (!this._commands.length) {
			throw new Error(`commands cannot be empty`);
		}
	}
}
