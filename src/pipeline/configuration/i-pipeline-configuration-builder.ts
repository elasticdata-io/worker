import { AbstractCommand } from '../command/abstract-command';
import { SettingsConfiguration } from './settings-configuration';
import { DataRule } from '../data/dto/data-rule';

export interface IPipelineConfigurationBuilder {
  buildFromJson(json: any): IPipelineConfigurationBuilder;
  readonly commands: AbstractCommand[];
  readonly commandsJson: string;
  readonly settings: SettingsConfiguration;
  readonly dataRules: Array<DataRule>;
}
