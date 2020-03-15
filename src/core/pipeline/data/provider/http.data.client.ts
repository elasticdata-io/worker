import axios from 'axios';
import { inject, injectable } from 'inversify';
import { KeyValueData } from '../../../../data-store/dto/key.value.data';
import { TYPES } from '../../types';

@injectable()
export class HttpDataClient {

	private readonly _servicePath = '/store/v1';
	private readonly _serviceUrl: string;

	constructor(@inject(TYPES.ServiceUrl) serviceUrl: string) {
		this._serviceUrl = serviceUrl;
	}

	async put(data: KeyValueData): Promise<void> {
		const res = await axios.post(`${this._serviceUrl}${this._servicePath}`, {
			...data
		});
		if (!res.data.success) {
			throw res.data.message;
		}
		console.log(data);
	}
}
