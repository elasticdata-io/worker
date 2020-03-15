import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';

export abstract class AbstractQueryProvider implements QueryProvider {

	protected abstract getSelectionFn(selector: string, suffix: string): Function;

	getSelectionElFn(command: AbstractCommand, suffix: string): Function {
		const selector = command.getSelector();
		// todo: replace with loop
		return this.getSelectionFn(selector, suffix);
	}

	abstract isSupporting(command: AbstractCommand): boolean;
}
