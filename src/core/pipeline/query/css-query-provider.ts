import { AbstractQueryProvider } from './abstract-query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

@injectable()
export class CssQueryProvider extends AbstractQueryProvider {

	protected getDomSelector(selector: string) {
		return `document.querySelector(\`${selector}\`)`;
	}

	isCompatibilitySelector(command: AbstractCommand): boolean {
		const selector = command.getSelector();
		const isXpath = selector.startsWith('//') || selector.startsWith('(');
		return isXpath === false;
	}
}
