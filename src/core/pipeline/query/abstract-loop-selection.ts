import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { DataContextResolver } from '../data/data-context-resolver';

@injectable()
export abstract class AbstractLoopSelection {

	protected static SPLIT_LOOP_INDEX_PATTERN = /(\{\$i:?[a-z0-9]*\})/gi;
	protected static LOOP_INDEX_PATTERN = /\{\$i:?([0-9a-z]+)?\}/gi;

	public abstract querySelectorAll(command: AbstractCommand, resolver: DataContextResolver): string;
	public abstract querySelector(command: AbstractCommand, resolver: DataContextResolver): string;

	protected _getSelectorsWithIndex(command: AbstractCommand, resolver: DataContextResolver): (string | number)[] {
		const cmdSelector = command.getSelector();
		const selectors = cmdSelector.split(AbstractLoopSelection.SPLIT_LOOP_INDEX_PATTERN);
		return selectors
		  .filter(x => x !== undefined && x !== null && x !== '')
		  .map(selector => {
			  if (AbstractLoopSelection.SPLIT_LOOP_INDEX_PATTERN.test(selector)) {
				  return this.getElIndex(command, selector, resolver);
			  }
			  return selector;
		  });
	}
	protected getElIndex(command: AbstractCommand, loopIndexDsl: string, resolver: DataContextResolver): number {
		const contextName = loopIndexDsl.replace(AbstractLoopSelection.LOOP_INDEX_PATTERN, '$1');
		return resolver.resolveIndex(command, contextName);
	}
}
