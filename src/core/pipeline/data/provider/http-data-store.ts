import { AbstractStore } from '../abstract-store';
import { AbstractCommand } from '../../command/abstract-command';
import { HttpDataClient } from './http.data.client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataContextResolver } from '../data-context-resolver';
import { Environment } from '../../environment';
import { TaskResult } from '../dto/task.result';

@injectable()
export class HttpDataStore extends AbstractStore {

	protected httpDataClient: HttpDataClient;
	protected userUuid: string;
	protected taskId: string;

	constructor(@inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver,
				@inject(TYPES.HttpDataClient) httpDataClient: HttpDataClient,
				@inject(TYPES.Environment) env: Environment) {
		super(dataContextResolver);
		this.userUuid = env.userUuid;
		this.taskId = env.taskId;
		this.httpDataClient = httpDataClient;
	}

	async putAll(data: any[], command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.putAll(context, data);
	}

	async put(key: string, value: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		console.log(`context: ${context}, command: ${command}`);
		await this.httpDataClient.put({
			key: key,
			value: value,
			context: context,
			id: this.id,
			userUuid: this.userUuid,
		});
	}

	async putFile(key: string, file: Buffer, fileExtension: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.putFile({
			key: key,
			file: file,
			fileExtension: fileExtension,
			context: context,
			id: this.id,
			userUuid: this.userUuid,
		});
	}

	async attachJsonFile(json: any, command: AbstractCommand): Promise<string> {
		const buffer = Buffer.from(JSON.stringify(json, null, 4));
		const metadata = {'content-type': 'application/json;charset=UTF-8'};
		return await this.attachFile(buffer, '.json', metadata, command);
	}

	async attachFile(file: Buffer, fileExtension: string, metadata: any, command: AbstractCommand): Promise<string> {
		return await this.httpDataClient.attachFile({
			file: file,
			fileExtension: fileExtension,
			id: this.id,
			userUuid: this.userUuid,
			metadata: metadata,
		});
	}

	async getDocument(): Promise<any>  {
		return this.httpDataClient.getDocument(this.id, this.userUuid);
	}

	async commit(): Promise<TaskResult>  {
		return this.httpDataClient.commit({
			bucket: this.userUuid,
			fileName: `${this.taskId}.json`,
			storeId: this.id,
		});
	}
}
