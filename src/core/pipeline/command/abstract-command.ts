import { BrowserProvider } from '../browser/browser-provider';
import { inject, injectable } from 'inversify';
import { Selectable } from '../query/selectable';
import { QueryProvider } from '../query/query-provider';
import { QueryProviderFactory } from '../query/query-provider-factory';
import { TYPES as ROOT_TYPES } from '../types';
import { Driver } from '../driver/driver';
import { IBrowserProvider } from '../browser/i-browser-provider';
import { AbstractStore } from '../data/abstract-store';

@injectable()
export abstract class AbstractCommand implements Selectable {
	private _nextCommand: AbstractCommand;

	protected store: AbstractStore;
	protected driver: Driver;
	protected queryProviderFactory: QueryProviderFactory;
	protected browserProvider: BrowserProvider;

	constructor(@inject(ROOT_TYPES.Driver) driver: Driver,
				@inject(ROOT_TYPES.IBrowserProvider) browserProvider: IBrowserProvider,
				@inject(ROOT_TYPES.AbstractStore) store: AbstractStore,
				@inject(ROOT_TYPES.QueryProviderFactory) queryProviderFactory: QueryProviderFactory) {
		this.driver = driver;
		this.store = store;
		this.browserProvider = browserProvider;
		this.queryProviderFactory = queryProviderFactory;
	}

	public selector: string;
	public timeout: number;

	public setNextCommand(nextCommand: AbstractCommand): void {
		this._nextCommand = nextCommand;
	}

	public async execute(): Promise<void> {
		await this.afterExecute();
	}

	protected async afterExecute(): Promise<void> {
		if (this._nextCommand) {
			return this.browserProvider.execute(this._nextCommand);
		}
	}

	getSelector(): string {
		return this.selector;
	}

	getQueryProvider(): QueryProvider {
		return this.queryProviderFactory.resolve(this);
	}
}
