import { AbstractStore } from '../abstract-store';
import { AbstractCommand } from '../../command/abstract-command';
import { HttpDataClient } from './http.data.client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { DataContextResolver } from '../data-context-resolver';

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
}
