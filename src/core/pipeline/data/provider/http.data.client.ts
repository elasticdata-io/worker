import axios from 'axios';
import * as FormData from 'form-data';
import { request } from 'http';
import { createReadStream } from 'fs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { KeyValueData } from '../dto/key.value.data';
import { KeyFileData } from '../dto/key.file.data';
import * as fs from 'fs';

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
	}

	async putFile(data: KeyFileData): Promise<void> {
		const url = new URL(`${this._serviceUrl}${this._servicePath}/upload/${data.id}/${data.context}/${data.key}`);
		const form = new FormData();
		const file = data.file;
		form.append('file', file, {filename: 'file'});
		const req = await request(
		  {
			  protocol: url.protocol,
			  host: url.hostname,
			  path: url.pathname,
			  port: url.port,
			  method: 'POST',
			  headers: form.getHeaders(),
		  }, response => {
			  console.log(response.statusCode);
		  }
		);
		console.log(form.getHeaders());
		form.pipe(req);
	}

	async getDocument(storeId: string): Promise<any> {
		const res = await axios.get(`${this._serviceUrl}${this._servicePath}/${storeId}`);
		return res.data;
	}
}
