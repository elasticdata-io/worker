import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

export interface ExecuteCommandConfig {
  silent: boolean;
  inDataContext?: AbstractCommand;
  inPageContext?: AbstractCommand | number;
}

@injectable()
export abstract class IBrowserProvider {
  abstract start(command: AbstractCommand): Promise<void>;
  abstract execute(
    command: AbstractCommand,
    config?: ExecuteCommandConfig,
  ): Promise<void>;
  abstract waitCompleted(): Promise<void>;
}
