import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';
import { CssQueryProvider } from './css/css-query-provider';
import { XpathQueryProvider } from './xpath/xpath-query-provider';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class QueryProviderFactory {

	constructor(@inject(TYPES.CssQueryProvider) private cssQueryProvider: CssQueryProvider,
				@inject(TYPES.XpathQueryProvider) private xpathQueryProvider: XpathQueryProvider) {
	}

	resolve(command: AbstractCommand): QueryProvider {
		if (this.cssQueryProvider.isSupporting(command)) {
			return this.cssQueryProvider;
		}
		if (this.xpathQueryProvider.isSupporting(command)) {
			return this.xpathQueryProvider;
		}
	}
}
