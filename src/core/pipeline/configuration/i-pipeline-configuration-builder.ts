import { AbstractCommand } from '../command/abstract-command';
import { SettingsConfiguration } from './settings-configuration';

export interface IPipelineConfigurationBuilder {
	buildFromJson(json: any): IPipelineConfigurationBuilder;
	readonly commands: AbstractCommand[];
	readonly settings: SettingsConfiguration;
}
