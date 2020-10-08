import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

export interface ExecuteCommandConfig {
	silent: boolean,
	inDataContext?: AbstractCommand,
	inPageContext?: AbstractCommand,
}

@injectable()
export abstract class IBrowserProvider {
	abstract execute(command: AbstractCommand, config?: ExecuteCommandConfig): Promise<void>;
	abstract waitCompleted(): Promise<void>;
}
