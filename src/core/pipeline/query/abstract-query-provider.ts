import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';

export abstract class AbstractQueryProvider implements QueryProvider {

	protected abstract getElementActionFn(selector: string, actionSuffix: string): Function;
	protected abstract getElementsActionFn(selector: string, actionSuffix: string): Function;

	getElementFn(command: AbstractCommand, actionSuffix: string): Function {
		const selector = command.getSelector();
		// todo: replace with loop
		return this.getElementActionFn(selector, actionSuffix);
	}

	getElementsFn(command: AbstractCommand, actionSuffix: string): Function {
		const selector = command.getSelector();
		// todo: replace with loop
		return this.getElementsActionFn(selector, actionSuffix);
	}

	abstract isSupporting(command: AbstractCommand): boolean;
}
