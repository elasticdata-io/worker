import { AbstractCommandAnalyzer } from '../abstract.command.analyzer';
import { AbstractCommand } from '../../command/abstract-command';
import { inject, injectable } from 'inversify';
import { CommandInformation } from '../command.information';
import moment = require('moment');
import { TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { PageContextResolver } from '../../browser/page-context-resolver';
import { OpenTabCommand } from '../../v2.0/command/open-tab.command';
import { EventBus, PipelineCommandEvent } from '../../event-bus';
import { TaskCommandExecuteDto } from '../../../dto/task.command.execute.dto';
import { Environment } from '../../environment';

@injectable()
export class JsonCommandAnalyzer extends AbstractCommandAnalyzer {
  private _dataContextResolver: DataContextResolver;
  private _pageContextResolver: PageContextResolver;
  private _environment: Environment;
  private _eventBus: EventBus;
  private readonly _commands: CommandInformation[];
  private readonly _tmpCommands: { [key: string]: CommandInformation };
  private readonly COMMANDS_IGNORED = [OpenTabCommand];

  constructor(
    @inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver,
    @inject(TYPES.PageContextResolver) pageContextResolver: PageContextResolver,
    @inject(TYPES.Environment) environment: Environment,
    @inject(TYPES.EventBus) eventBus: EventBus,
  ) {
    super();
    this._commands = [];
    this._tmpCommands = {};
    this._dataContextResolver = dataContextResolver;
    this._pageContextResolver = pageContextResolver;
    this._environment = environment;
    this._eventBus = eventBus;
  }

  private async _notify(command: AbstractCommand): Promise<void> {
    try {
      const dto: TaskCommandExecuteDto = {
        designTimeConfig: command.designTimeConfig,
        cmd: command.cmd,
        uuid: command.uuid,
        userId: this._environment.userUuid,
        taskId: this._environment.taskId,
        pipelineId: this._environment.pipelineId,
      };
      await this._eventBus.emit(
        PipelineCommandEvent.START_EXECUTE_COMMAND,
        dto,
      );
    } catch (e) {}
  }
  private _isIgnoredCommand(command: AbstractCommand): boolean {
    const find = this.COMMANDS_IGNORED.find((x) => {
      return command instanceof x;
    });
    return Boolean(find);
  }
  private async _getRuntimeConfig(command: AbstractCommand): Promise<any> {
    const runTimeConfig = {};
    const managedKeys = command.getManagedKeys();
    for (const managedKey of managedKeys) {
      if (typeof managedKey === 'object') {
        const key = (managedKey as any).key as string;
        const fn = (managedKey as any).fn as () => Promise<string>;
        runTimeConfig[key] = await fn.call(command);
      } else {
        runTimeConfig[managedKey.toString()] = command[managedKey.toString()];
      }
    }
    return runTimeConfig;
  }

  public async setCommandData(
    command: AbstractCommand,
    value: any,
  ): Promise<void> {
    if (this._isIgnoredCommand(command)) {
      return;
    }
    const info = this._tmpCommands[command.uuid];
    if (!info) {
      return;
    }
    info.dataValue = value;
  }
  public async startCommand(command: AbstractCommand): Promise<void> {
    if (this._isIgnoredCommand(command)) {
      return;
    }
    await this._notify(command);
    if (command.designTimeConfig && command.designTimeConfig.commands) {
      delete command.designTimeConfig.commands;
    }
    const commandInformation = {
      cmd: command.cmd,
      name: command.constructor.name,
      startOnUtc: moment().utc().toDate(),
      uuid: command.uuid,
      dataContext: this._dataContextResolver.resolveContext(command),
      pageContext: this._pageContextResolver.resolveContext(command),
      designTimeConfig: command.designTimeConfig,
      materializedUuidPath: command.materializedUuidPath,
    } as CommandInformation;
    delete commandInformation.designTimeConfig.materializedUuidPath;
    this._tmpCommands[command.uuid] = commandInformation;
  }
  public async endCommand(command: AbstractCommand): Promise<void> {
    if (this._isIgnoredCommand(command)) {
      return;
    }
    const info = this._tmpCommands[command.uuid];
    if (!info) {
      return;
    }
    info.endOnUtc = moment().utc().toDate();
    info.status = 'success';
    info.runTimeConfig = await this._getRuntimeConfig(command);
    this._commands.push(info);
    this._tmpCommands[command.uuid] = null;
  }
  public async errorCommand(
    command: AbstractCommand,
    failureReason: string,
  ): Promise<void> {
    if (this._isIgnoredCommand(command)) {
      return;
    }
    const info = this._tmpCommands[command.uuid];
    if (!info) {
      return;
    }
    info.endOnUtc = moment().utc().toDate();
    info.status = 'error';
    info.runTimeConfig = await this._getRuntimeConfig(command);
    info.failureReason = failureReason;
    this._commands.push(info);
    this._tmpCommands[command.uuid] = null;
  }
  public getCommands(): Promise<CommandInformation[]> {
    const commands = this._commands.sort((a, b) => {
      if (a.materializedUuidPath > b.materializedUuidPath) {
        return 1;
      }
      if (a.materializedUuidPath < b.materializedUuidPath) {
        return -1;
      }
      if (a.dataContext > b.dataContext) {
        return 1;
      }
      if (a.dataContext < b.dataContext) {
        return -1;
      }
      return 0;
    });
    return Promise.resolve(commands);
  }
}
