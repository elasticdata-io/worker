import { AbstractCommand } from '../command/abstract-command';
import { SettingsConfiguration } from './settings-configuration';

export interface IPipelineConfigurationBuilder {
	setJson(json: any): IPipelineConfigurationBuilder;
	buildCommands(): AbstractCommand[];
	buildSettings(): SettingsConfiguration;
}
