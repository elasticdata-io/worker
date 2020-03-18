import axios from 'axios';
import * as FormData from 'form-data';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { KeyValueData } from '../dto/key.value.data';
import { KeyFileData } from '../dto/key.file.data';
import { DataResult } from '../dto/data.result';
import { CommitDocument } from '../dto/commit.document';

@injectable()
export class HttpDataClient {

	private readonly _servicePath = '/v1/store';
	private readonly _serviceUrl: string;

	constructor(@inject(TYPES.DataServiceUrl) serviceUrl: string) {
		this._serviceUrl = serviceUrl;
	}

	async putAll(context: string, data: any[]): Promise<void> {
		await axios.post(`${this._serviceUrl}${this._servicePath}/append`, data);
	}

	async put(data: KeyValueData): Promise<void> {
		const config = {
			headers: {
				userUuid: data.userUuid,
			},
		};
		const res = await axios.post(`${this._serviceUrl}${this._servicePath}`, data, config);
		if (!res.data.success) {
			throw res.data.message;
		}
	}

	async putFile(data: KeyFileData): Promise<void> {
		const url = new URL(`${this._serviceUrl}${this._servicePath}/upload/${data.id}/${data.context}/${data.fileExtension}/${data.key}`);
		const form = new FormData();
		const file = data.file;
		form.append('file', file, { filename: 'file' });
		const config = {
			headers: {
				...form.getHeaders(),
				userUuid: data.userUuid,
			},
		};
		await axios.post(url.href, form, config);
	}

	async getDocument(storeId: string, userUuid: string): Promise<any> {
		const config = {
			headers: {
				userUuid: userUuid,
			},
		};
		const res = await axios.get(`${this._serviceUrl}${this._servicePath}/${storeId}`, config);
		return res.data;
	}

	async commit(data: CommitDocument): Promise<DataResult> {
		const res = await axios.post(`${this._serviceUrl}${this._servicePath}/commit`, data);
		return res.data;
	}
}
