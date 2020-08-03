import { AbstractStore } from '../abstract-store';
import { AbstractCommand } from '../../command/abstract-command';
import { HttpDataClient } from './http.data.client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataContextResolver } from '../data-context-resolver';
import { Environment } from '../../environment';
import { TaskResult } from '../dto/task.result';
import { DataRule } from '../dto/data-rule';
import { AbstractCommandAnalyzer } from '../../analyzer/abstract.command.analyzer';

@injectable()
export class HttpDataStore extends AbstractStore {

	protected httpDataClient: HttpDataClient;
	protected userUuid: string;
	protected taskId: string;
	protected commandAnalyzer: AbstractCommandAnalyzer;

	constructor(
		@inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver,
		@inject(TYPES.HttpDataClient) httpDataClient: HttpDataClient,
		@inject(TYPES.Environment) env: Environment,
		@inject(TYPES.AbstractCommandAnalyzer) commandAnalyzer: AbstractCommandAnalyzer,
	) {
		super(dataContextResolver);
		this.userUuid = env.userUuid;
		this.taskId = env.taskId;
		this.httpDataClient = httpDataClient;
		this.commandAnalyzer = commandAnalyzer;
	}

	/**
	 * Replace data macros, example ${line.[key]}.
	 * @param command
	 * @param inputWithMacros
	 */
	async replaceMacros(command: AbstractCommand, inputWithMacros: string): Promise<any> {
		const context = this.contextResolver.resolveContext(command);
		return await this.httpDataClient.replaceMacros({
			context: context,
			inputWithMacros: inputWithMacros,
			id: this.id,
		});
	}

	/**
	 * Put array to store with context.
	 * Used in the import command.
	 * @param data
	 * @param command
	 */
	async putAll(data: any[], command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.putAll(context, data);
	}

	/**
	 * Put key-value data to store.
	 * @param key
	 * @param value
	 * @param command
	 */
	async put(key: string, value: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.put({
			key: key,
			value: value,
			context: context,
			id: this.id,
			userUuid: this.userUuid,
		});
		await this.commandAnalyzer.setCommandData(command, value);
	}

	async get(key: string, command: AbstractCommand): Promise<any> {
		const context = this.contextResolver.resolveContext(command);
		return await this.httpDataClient.get({
			key: key,
			context: context,
			id: this.id,
			userUuid: this.userUuid,
		});
	}

	async remove(key: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.remove({
			key: key,
			context: context,
			id: this.id,
			userUuid: this.userUuid,
		});
	}

	/**
	 * Attach file in user folder with command context.
	 * @param key
	 * @param file
	 * @param fileExtension
	 * @param command
	 */
	async putFile(key: string, file: Buffer, fileExtension: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		const link = await this.httpDataClient.putFile({
			key: key,
			file: file,
			fileExtension: fileExtension,
			context: context,
			id: this.id,
			userUuid: this.userUuid,
		});
		await this.commandAnalyzer.setCommandData(command, link);
	}

	/**
	 * Attach JSON file without context but in user folder.
	 * Return JSON file public link.
	 * @param json
	 * @param command
	 */
	async attachJsonFile(json: any, command: AbstractCommand): Promise<string> {
		const buffer = Buffer.from(JSON.stringify(json, null, 4));
		const metadata = {'content-type': 'application/json;charset=UTF-8'};
		const link = await this.attachFile(buffer, '.json', metadata, command);
		await this.commandAnalyzer.setCommandData(command, link);
		return link;
	}

	/**
	 * Attach file without context but in user folder.
	 * Return file public link.
	 * @param file
	 * @param fileExtension
	 * @param metadata
	 * @param command
	 */
	async attachFile(file: Buffer, fileExtension: string, metadata: any, command: AbstractCommand): Promise<string> {
		const link = await this.httpDataClient.attachFile({
			file: file,
			fileExtension: fileExtension,
			id: this.id,
			userUuid: this.userUuid,
			metadata: metadata,
		});
		await this.commandAnalyzer.setCommandData(command, link);
		return link;
	}

	/**
	 * Freezing all data and return.
	 */
	async commit(): Promise<TaskResult>  {
		return this.httpDataClient.commit({
			bucket: this.userUuid,
			fileName: `${this.taskId}.json`,
			storeId: this.id,
		});
	}

	/**
	 * Sets data rules to storage.
	 * @param dataRules
	 */
	async setDataRules(dataRules: Array<DataRule>): Promise<void>  {
		if (!dataRules || !dataRules.length) {
			return;
		}
		return this.httpDataClient.setDataRules({
			rules: dataRules,
			storageId: this.id,
		});
	}
}
