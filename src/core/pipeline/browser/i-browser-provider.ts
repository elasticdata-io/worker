import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

@injectable()
export abstract class IBrowserProvider {
	abstract execute(command: AbstractCommand): Promise<void>;
}
