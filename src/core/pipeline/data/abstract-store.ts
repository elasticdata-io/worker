import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';
import { DataContextResolver } from './data-context-resolver';
import { StringGenerator } from '../util/string.generator';

@injectable()
export abstract class AbstractStore {

	protected id: string;
	protected contextResolver: DataContextResolver;

	protected constructor(dataContextResolver: DataContextResolver) {
		this.contextResolver = dataContextResolver;
		this.id = StringGenerator.generate();
	}

	abstract put(key: string, value: string, command: AbstractCommand): Promise<void>;
	abstract putFile(key: string, file: Buffer, command: AbstractCommand): Promise<void>;
	abstract getDocument(): Promise<any>;
}
