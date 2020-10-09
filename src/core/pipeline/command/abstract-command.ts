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
import {LineMacrosParser} from "../data/line-macros-parser";
import {PageContextResolver} from "../browser/page-context-resolver";
import { StringGenerator } from '../util/string.generator';
import {UserInteractionInspector} from "../user-interaction/user-interaction-inspector";
import {eventBus, PipelineCommandEvent} from "../event-bus";

export abstract class AbstractCommand implements Selectable {

	private _nextCommand: AbstractCommand;
	private readonly _commandAnalyzer: AbstractCommandAnalyzer;
	private readonly _userInteractionInspector: UserInteractionInspector;
	private _keyCommand: AbstractCommand;

	protected store: AbstractStore;
	protected driver: Driver;
	protected queryProviderFactory: QueryProviderFactory;
	protected browserProvider: IBrowserProvider;
	protected dataContextResolver: DataContextResolver;
	protected pageContextResolver: PageContextResolver;
	protected ioc: PipelineIoc;

	constructor(ioc: PipelineIoc) {
		this.driver = ioc.get<Driver>(ROOT_TYPES.Driver);
		this.store = ioc.get<AbstractStore>(ROOT_TYPES.AbstractStore);
		this.browserProvider = ioc.get<BrowserProvider>(ROOT_TYPES.IBrowserProvider);
		this.queryProviderFactory = ioc.get<QueryProviderFactory>(ROOT_TYPES.QueryProviderFactory);
		this.dataContextResolver = ioc.get<DataContextResolver>(ROOT_TYPES.DataContextResolver);
		this.pageContextResolver = ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		this.ioc = ioc;
		this._commandAnalyzer = this.ioc.get<AbstractCommandAnalyzer>(ROOT_TYPES.AbstractCommandAnalyzer);
		this._userInteractionInspector = this.ioc.get<UserInteractionInspector>(ROOT_TYPES.UserInteractionInspector);
	}

	public designTimeConfig: any;
	public cmd = '';
	public key: string | AbstractCommand = '';
	public selector = '';
	public timeout = 1;
	public uuid = StringGenerator.generate();
	public materializedUuidPath = '';

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
			await eventBus.emit(PipelineCommandEvent.BEFORE_EXECUTE_NEXT_COMMAND, this);
			return this.browserProvider.execute(this._nextCommand);
		}
	}

	public getManagedKeys(): Array<{key: string, fn: () => Promise<string> } | string> {
		return ['cmd', 'timeout'];
	}

	public getSelector(): string {
		return this.selector;
	}

	public getQueryProvider(): QueryProvider {
		return this.queryProviderFactory.resolve(this);
	}

	public async getKey(): Promise<string> {
		if (typeof this.key === 'string' && this.key.length > 0) {
			return this.key;
		}
		const keyCommand = this._keyCommand;
		if (keyCommand) {
			await this.browserProvider.execute(keyCommand, {silent: true, inDataContext: this});
			const key = await keyCommand.getKey()
			const keyValue = await this.store.get(key, keyCommand);
			if (key.startsWith('tmp_')) {
				await this.store.remove(key, keyCommand);
			}
			return keyValue;
		}
		return `tmp_${this.uuid}`;
	}

	public async replaceMacros(inputWithMacros: string, command: AbstractCommand): Promise<any> {
		if (LineMacrosParser.hasAnyMacros(inputWithMacros)) {
			const replaced = await this.store.replaceMacros(command, inputWithMacros);
			// console.log(`from: ${inputWithMacros}, to: ${replaced}`);
			return replaced;
		}
		return inputWithMacros;
	}

	public setDataContext(dataContext: string): void {
		this.dataContextResolver.setContext(this, dataContext);
	}

	public setPageContext(pageContext: number): void {
		this.pageContextResolver.setContext(this, pageContext);
	}
}
