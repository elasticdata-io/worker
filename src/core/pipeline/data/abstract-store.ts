import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractStore {
	abstract put(key: string, value: string, command: AbstractCommand): Promise<void>;
}
