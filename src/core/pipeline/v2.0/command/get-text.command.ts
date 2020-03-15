import { AbstractCommand } from '../../command/abstract-command';
import { inject } from 'inversify';
import { TYPES as ROOT_TYPES } from '../../types';
import { Driver } from '../../driver/driver';
import { QueryProviderFactory } from '../../query/query-provider-factory';
import { IBrowserProvider } from '../../browser/i-browser-provider';

export class GetTextCommand extends AbstractCommand {
	constructor(@inject(ROOT_TYPES.Driver) private _driver: Driver,
				@inject(ROOT_TYPES.IBrowserProvider) browserProvider: IBrowserProvider,
				@inject(ROOT_TYPES.QueryProviderFactory) queryProviderFactory: QueryProviderFactory) {
		super();
		this.browserProvider = browserProvider;
		this.queryProviderFactory = queryProviderFactory;
	}

	async execute(): Promise<void> {
		const text = await this._driver.getElText(this);
		console.log(text);
		super.execute();
	}
}
