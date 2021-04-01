import { AbstractQueryProvider } from '../abstract-query-provider';
import { AbstractCommand } from '../../command/abstract-command';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { CssLoopSelection } from '../css/css-loop-selection';
import { XpathLoopSelection } from './xpath-loop-selection';

@injectable()
export class XpathQueryProvider extends AbstractQueryProvider {

	constructor(@inject(TYPES.DataContextResolver) protected dataContextResolver: DataContextResolver,
				@inject(TYPES.XpathLoopSelection) protected xpathLoopSelection: XpathLoopSelection) {
		super(dataContextResolver);
	}

	protected getElementActionFn(command: AbstractCommand, suffix: string) {
		const querySelector = this.xpathLoopSelection.querySelector(command, this.dataContextResolver);
		return new Function(`${querySelector}${suffix}`);
	}

	protected getElementsActionFn(command: AbstractCommand, actionSuffix: string): Function {
		const querySelector = this.xpathLoopSelection.querySelectorAll(command, this.dataContextResolver);
		return new Function(`${querySelector}${actionSuffix}`);
	}

	public isSupporting(command: AbstractCommand): boolean {
		const selector = command.getSelector();
		return selector.startsWith('//') || selector.startsWith('(');
	}
}
