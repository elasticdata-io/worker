import axios from 'axios';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { KeyValueData } from '../dto/key.value.data';

@injectable()
export class HttpDataClient {

	private readonly _servicePath = '/v1/store';
	private readonly _serviceUrl: string;

	constructor(@inject(TYPES.DataServiceUrl) serviceUrl: string) {
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

	async getDocument(storeId: string): Promise<any> {
		const res = await axios.get(`${this._serviceUrl}${this._servicePath}/${storeId}`);
		return res.data;
	}
}
