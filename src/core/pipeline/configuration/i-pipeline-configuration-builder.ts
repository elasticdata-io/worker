import { AbstractCommand } from '../command/abstract-command';
import { SettingsConfiguration } from './settings-configuration';

export abstract class IPipelineConfigurationBuilder {
	abstract setJson(json: any): IPipelineConfigurationBuilder;
	abstract buildCommands(): AbstractCommand[];
	abstract buildSettings(): SettingsConfiguration;
}
