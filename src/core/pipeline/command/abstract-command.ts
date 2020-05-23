import { BrowserProvider } from '../browser/browser-provider';
import { Selectable } from '../query/selectable';
import { QueryProvider } from '../query/query-provider';
import { QueryProviderFactory } from '../query/query-provider-factory';
import { TYPES as ROOT_TYPES } from '../types';
import { Driver } from '../driver/driver';
import { IBrowserProvider } from '../browser/i-browser-provider';
import { AbstractStore } from '../data/abstract-store';
import { PipelineIoc } from '../pipeline-ioc';
import { DataContextResolver } from '../data/data-context-resolver';
import { AbstractCommandAnalyzer } from '../analyzer/abstract.command.analyzer';

export abstract class AbstractCommand implements Selectable {
	private _nextCommand: AbstractCommand;
	private _commandAnalyzer: AbstractCommandAnalyzer;
	private _keyCommand: AbstractCommand;

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
		this.ioc = ioc;
		this._commandAnalyzer = this.ioc.get<AbstractCommandAnalyzer>(ROOT_TYPES.AbstractCommandAnalyzer);
	}

	public cmd: string;
	public key: string | AbstractCommand;
	public selector: string;
	public timeout = 1;
	public uuid: string;

	public setKeyCommand (command: AbstractCommand) {
		this._keyCommand = command;
	}

	public setNextCommand(nextCommand: AbstractCommand): void {
		this._nextCommand = nextCommand;
	}

	public async execute(): Promise<any> {
		if (this._commandAnalyzer) {
			await this._commandAnalyzer.endCommand(this);
		}
		await this.afterExecute();
	}

	protected async afterExecute(): Promise<void> {
		if (this._nextCommand) {
			return this.browserProvider.execute(this._nextCommand);
		}
	}

	public getManagedKeys(): string[] {
		return ['cmd', 'timeout'];
	}

	public getSelector(): string {
		return this.selector;
	}

	public getQueryProvider(): QueryProvider {
		return this.queryProviderFactory.resolve(this);
	}

	public async getKey(): Promise<string> {
		if (typeof this.key === 'string') {
			return this.key;
		}
		const keyCommand = this._keyCommand;
		if (keyCommand) {
			await this.browserProvider.execute(keyCommand, {silent: true, context: this});
			const key = await keyCommand.getKey()
			const keyValue = await this.store.get(key, keyCommand);
			await this.store.remove(key, keyCommand);
			return keyValue;
		}
		return this.uuid;
	}

}
