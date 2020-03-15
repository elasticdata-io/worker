import { IPipelineConfigurationBuilder } from '../../configuration/i-pipeline-configuration-builder';
import { ICommandFactory } from '../../command/i-command-factory';
import { SettingsConfiguration } from '../../configuration/settings-configuration';
import { AbstractCommand } from '../../command/abstract-command';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';

@injectable()
export class PipelineConfigurationBuilder implements IPipelineConfigurationBuilder {
  private _json: any;

  constructor(@inject(TYPES.ICommandFactory) private _commandFactory: ICommandFactory) {
  }

  public commands: any[];
  public dataRules: any[];
  public settings: SettingsConfiguration;

  buildCommands(): AbstractCommand[] {
    const pipeline = JSON.parse(this._json);
    const commandsJson = JSON.stringify(pipeline.commands);
    this.commands = this._commandFactory.createChainCommands(commandsJson);
    return this.commands;
  }

  buildSettings(): SettingsConfiguration {
    return this.settings;
  }

  setJson(json: any): IPipelineConfigurationBuilder {
    this._json = json;
    return this;
  }
}
