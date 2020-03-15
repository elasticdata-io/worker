import { AbstractCommand } from '../../command/abstract-command';
import { Driver } from '../../driver/driver';
import { inject } from 'inversify';
import { TYPES as ROOT_TYPES } from '../../types';
import { IBrowserProvider } from '../../browser/i-browser-provider';
import { QueryProviderFactory } from '../../query/query-provider-factory';

export class OpenUrlCommand extends AbstractCommand {
	constructor(@inject(ROOT_TYPES.Driver) private _driver: Driver,
				@inject(ROOT_TYPES.IBrowserProvider) browserProvider: IBrowserProvider,
				@inject(ROOT_TYPES.QueryProviderFactory) queryProviderFactory: QueryProviderFactory) {
		super();
		this.browserProvider = browserProvider;
		this.queryProviderFactory = queryProviderFactory;
	}

	public link: string;

	async execute(): Promise<void> {
		await this._driver.goToUrl(this.link);
		super.execute();
	}

}
