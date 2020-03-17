import { AbstractQueryProvider } from './abstract-query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';

@injectable()
export class XpathQueryProvider extends AbstractQueryProvider {

	protected getElementActionFn(selector: string, suffix: string) {
		const fn = `return document.evaluate(\`${selector.trim()}\`,
		  document, null,  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)`;
		return new Function(`${fn}${suffix}`);
	}

	isSupporting(command: AbstractCommand): boolean {
		const selector = command.getSelector();
		const isXpath = selector.startsWith('//') || selector.startsWith('(');
		return isXpath === true;
	}

	protected getElementsActionFn(selector: string, actionSuffix: string): Function {
		const fn = `return document.evaluate(\`${selector.trim()}\`,
		  document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)`;
		return new Function(`${fn}${actionSuffix}`);
	}
}
