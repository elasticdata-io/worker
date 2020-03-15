import { AbstractCommand } from '../command/abstract-command';
import { inject, injectable } from 'inversify';
import { DataContextResolver } from './data-context-resolver';
import { TYPES } from '../types';
import { StringGenerator } from '../util/string.generator';

@injectable()
export abstract class AbstractStore {

	protected id: string;
	protected contextResolver: DataContextResolver;

	constructor(@inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver) {
		this.contextResolver = dataContextResolver;
		this.id = StringGenerator.generate();
	}

	abstract put(key: string, value: string, command: AbstractCommand): Promise<void>;
}
