import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';

export abstract class AbstractQueryProvider implements QueryProvider {

	protected abstract getDomSelector(selector: string);

	getLoopElementSelector(command: AbstractCommand): string {
		const selector = command.getSelector();
		// todo: replace with loop
		return this.getDomSelector(selector);
	}

	abstract isCompatibilitySelector(command: AbstractCommand): boolean;
}
