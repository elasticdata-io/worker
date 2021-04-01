import { AbstractQueryProvider } from '../abstract-query-provider';
import { AbstractCommand } from '../../command/abstract-command';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataContextResolver } from '../../data/data-context-resolver';
import { CssLoopSelection } from './css-loop-selection';

@injectable()
export class CssQueryProvider extends AbstractQueryProvider {

	constructor(@inject(TYPES.DataContextResolver) protected dataContextResolver: DataContextResolver,
				@inject(TYPES.CssLoopSelection) protected cssLoopSelection: CssLoopSelection) {
		super(dataContextResolver);
	}

	protected getElementActionFn(command: AbstractCommand, actionSuffix: string): Function {
		const querySelector = this.cssLoopSelection.querySelector(command, this.dataContextResolver);
		return new Function(`return ${querySelector}${actionSuffix}`);
	}

	protected getElementsActionFn(command: AbstractCommand, actionSuffix: string): Function {
		const querySelectorAll = this.cssLoopSelection.querySelectorAll(command, this.dataContextResolver);
		return new Function(`return ${querySelectorAll}${actionSuffix}`);
	}

	public isSupporting(command: AbstractCommand): boolean {
		const selector = command.getSelector();
		return !selector.startsWith('//') && !selector.startsWith('(');
	}
}
