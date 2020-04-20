import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { DataContextResolver } from '../data/data-context-resolver';

@injectable()
export abstract class AbstractQueryProvider implements QueryProvider {

	protected constructor(@inject(TYPES.DataContextResolver) protected dataContextResolver: DataContextResolver) {}

	protected abstract getElementActionFn(command: AbstractCommand, actionSuffix: string): Function;
	protected abstract getElementsActionFn(command: AbstractCommand, actionSuffix: string): Function;

	getElementFn(command: AbstractCommand, actionSuffix: string): Function {
		return this.getElementActionFn(command, actionSuffix);
	}

	getElementsFn(command: AbstractCommand, actionSuffix: string): Function {
		return this.getElementsActionFn(command, actionSuffix);
	}

	abstract isSupporting(command: AbstractCommand): boolean;
}
