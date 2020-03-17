import { AbstractQueryProvider } from './abstract-query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

@injectable()
export class CssQueryProvider extends AbstractQueryProvider {

	protected getElementActionFn(selector: string, actionSuffix: string): Function {
		return new Function(`return document.querySelector(\`${selector}\`)${actionSuffix}`);
	}

	protected getElementsActionFn(selector: string, actionSuffix: string): Function {
		return new Function(`return document.querySelectorAll(\`${selector}\`)${actionSuffix}`);
	}

	isSupporting(command: AbstractCommand): boolean {
		const selector = command.getSelector();
		const isXpath = selector.startsWith('//') || selector.startsWith('(');
		return isXpath === false;
	}
}
