import { AbstractQueryProvider } from './abstract-query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

@injectable()
export class CssQueryProvider extends AbstractQueryProvider {

	protected getSelectionFn(selector: string, suffix: string) {
		return new Function(`return document.querySelector(\`${selector}\`)${suffix}`);
	}

	isSupporting(command: AbstractCommand): boolean {
		const selector = command.getSelector();
		const isXpath = selector.startsWith('//') || selector.startsWith('(');
		return isXpath === false;
	}
}
