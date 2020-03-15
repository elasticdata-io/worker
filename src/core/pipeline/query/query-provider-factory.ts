import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { CssQueryProvider } from './css-query-provider';
import { XpathQueryProvider } from './xpath-query-provider';
import { injectable } from 'inversify';

const css = new CssQueryProvider();
const xpath = new XpathQueryProvider();

@injectable()
export class QueryProviderFactory {

	resolve(command: AbstractCommand): QueryProvider {
		if (css.isCompatibilitySelector(command)) {
			return css;
		}
		if (xpath.isCompatibilitySelector(command)) {
			return xpath;
		}
	}
}
