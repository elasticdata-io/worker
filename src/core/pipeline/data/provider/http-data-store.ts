import { AbstractStore } from '../abstract-store';
import { AbstractCommand } from '../../command/abstract-command';
import { HttpDataClient } from './http.data.client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataContextResolver } from '../data-context-resolver';
import { Stream } from 'stream';

@injectable()
export class HttpDataStore extends AbstractStore {

	protected httpDataClient: HttpDataClient;

	constructor(@inject(TYPES.DataContextResolver) dataContextResolver: DataContextResolver,
				@inject(TYPES.HttpDataClient) httpDataClient: HttpDataClient) {
		super(dataContextResolver);
		this.httpDataClient = httpDataClient;
	}

	async put(key: string, value: string, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.put({
			key: key,
			value: value,
			context: context,
			id: this.id,
		});
	}

	async putFile(key: string, file: Buffer, command: AbstractCommand): Promise<void> {
		const context = this.contextResolver.resolveContext(command);
		await this.httpDataClient.putFile({
			key: key,
			file: file,
			context: context,
			id: this.id,
		});
	}

	async getDocument(): Promise<any>  {
		return this.httpDataClient.getDocument(this.id);
	}
}
