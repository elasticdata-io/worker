import { BrowserProvider } from '../browser/browser-provider';
import { Selectable } from '../query/selectable';
import { QueryProvider } from '../query/query-provider';
import { QueryProviderFactory } from '../query/query-provider-factory';
import { TYPES as ROOT_TYPES } from '../types';
import { Driver } from '../driver/driver';
import { IBrowserProvider } from '../browser/i-browser-provider';
import { AbstractStore } from '../data/abstract-store';
import { PipelineIoc } from '../pipeline-ioc';

export abstract class AbstractCommand implements Selectable {
	private _nextCommand: AbstractCommand;

	protected store: AbstractStore;
	protected driver: Driver;
	protected queryProviderFactory: QueryProviderFactory;
	protected browserProvider: IBrowserProvider;

	constructor(ioc: PipelineIoc) {
		this.driver = ioc.get<Driver>(ROOT_TYPES.Driver);
		this.store = ioc.get<AbstractStore>(ROOT_TYPES.AbstractStore);
		this.browserProvider = ioc.get<BrowserProvider>(ROOT_TYPES.IBrowserProvider);
		this.queryProviderFactory = ioc.get<QueryProviderFactory>(ROOT_TYPES.QueryProviderFactory);
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
