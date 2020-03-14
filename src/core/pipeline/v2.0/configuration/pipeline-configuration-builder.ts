import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IPipelineConfigurationBuilder } from '../../configuration/i-pipeline-configuration-builder';
import { ICommandFactory } from '../../command/i-command-factory';
import { SettingsConfiguration } from '../../configuration/settings-configuration';
import { AbstractCommand } from '../../command/abstract-command';

@Injectable()
export class PipelineConfigurationBuilder extends IPipelineConfigurationBuilder {
  private _json: any;

  constructor(private _moduleRef: ModuleRef,
              private _commandFactory: ICommandFactory) {
    super();
  }

  public commands: any[];
  public dataRules: any[];
  public settings: SettingsConfiguration;

  buildCommands(): AbstractCommand[] {
    const pipeline = JSON.parse(this._json);
    const commandsJson = JSON.stringify(pipeline.commands);
    this.commands = this._commandFactory.createCommands(commandsJson);
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
