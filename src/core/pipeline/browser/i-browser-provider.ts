import { AbstractCommand } from '../command/abstract-command';

export abstract class IBrowserProvider {
	abstract execute(command: AbstractCommand): Promise<void>;
}
