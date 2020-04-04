import { BrowserProvider } from '../browser/browser-provider';
import { Selectable } from '../query/selectable';
import { QueryProvider } from '../query/query-provider';
import { QueryProviderFactory } from '../query/query-provider-factory';
import { TYPES as ROOT_TYPES } from '../types';
import { Driver } from '../driver/driver';
import { IBrowserProvider } from '../browser/i-browser-provider';
import { AbstractStore } from '../data/abstract-store';
import { PipelineIoc } from '../pipeline-ioc';
import { StringGenerator } from '../util/string.generator';
import { DataContextResolver } from '../data/data-context-resolver';

export abstract class AbstractCommand implements Selectable {
	private _nextCommand: AbstractCommand;

	protected store: AbstractStore;
	protected driver: Driver;
	protected queryProviderFactory: QueryProviderFactory;
	protected browserProvider: IBrowserProvider;
	protected contextResolver: DataContextResolver;
	protected ioc: PipelineIoc;

	constructor(ioc: PipelineIoc) {
		this.driver = ioc.get<Driver>(ROOT_TYPES.Driver);
		this.store = ioc.get<AbstractStore>(ROOT_TYPES.AbstractStore);
		this.browserProvider = ioc.get<BrowserProvider>(ROOT_TYPES.IBrowserProvider);
		this.queryProviderFactory = ioc.get<QueryProviderFactory>(ROOT_TYPES.QueryProviderFactory);
		this.contextResolver = ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
		this.uuid = StringGenerator.generate();
		this.ioc = ioc;
	}

	public selector: string;
	public timeout = 1;
	public uuid: string;

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
