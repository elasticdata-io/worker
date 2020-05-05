import axios from 'axios';
import * as FormData from 'form-data';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { KeyValueData } from '../dto/key.value.data';
import { KeyFileData } from '../dto/key.file.data';
import { TaskResult } from '../dto/task.result';
import { CommitDocument } from '../dto/commit.document';
import { AttachFile } from '../dto/attach.file';
import { SystemError } from '../../command/exception/system-error';

@injectable()
export class HttpDataClient {

	private readonly _servicePath = '/v1/store';
	private readonly _serviceUrl: string;

	constructor(@inject(TYPES.DataServiceUrl) serviceUrl: string) {
		this._serviceUrl = serviceUrl;
	}

	/**
	 * Put array to store with context.
	 * Used in the import command.
	 * @param context
	 * @param data
	 */
	async putAll(context: string, data: any[]): Promise<void> {
		try {
			await axios.post(`${this._serviceUrl}${this._servicePath}/append`, data);
		} catch (e) {
			throw new SystemError(`putAll data is failed: ${e?.response?.data?.message || e.message}`);
		}
	}

	/**
	 * Put key-value data to store.
	 * @param data
	 */
	async put(data: KeyValueData): Promise<void> {
		try {
			const config = {
				headers: {
					userUuid: data.userUuid,
				},
			};
			const res = await axios.post(`${this._serviceUrl}${this._servicePath}`, data, config);
			if (!res.data.success) {
				throw new SystemError(res.data.message);
			}
		} catch (e) {
			throw new SystemError(`put data is failed: ${e?.response?.data?.message || e.message}`)
		}
	}

	/**
	 * Attach file in user folder with command context.
	 * @param data
	 */
	async putFile(data: KeyFileData): Promise<void> {
		try {
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
		} catch (e) {
			throw new SystemError(`putFile data is failed: ${e?.response?.data?.message || e.message}`);
		}
	}

	/**
	 * Attach file without context but in user folder.
	 * Return file public link.
	 * @param data
	 */
	async attachFile(data: AttachFile): Promise<string> {
		try {
			const url = new URL(`${this._serviceUrl}${this._servicePath}/attach/${data.id}/${data.fileExtension}`);
			const form = new FormData();
			const file = data.file;
			form.append('file', file, { filename: 'file' });
			const config = {
				headers: {
					...form.getHeaders(),
					userUuid: data.userUuid,
					metadata: JSON.stringify(data.metadata),
				},
			};
			const result = await axios.post(url.href, form, config);
			return result.data && result.data.file;
		} catch (e) {
			throw new SystemError(`attachFile data is failed: ${e?.response?.data?.message || e.message}`);
		}
	}

	/**
	 * Freezing all data and return.
	 * @param data
	 */
	async commit(data: CommitDocument): Promise<TaskResult> {
		try {
			const res = await axios.post(`${this._serviceUrl}${this._servicePath}/commit`, data);
			return res.data;
		} catch (e) {
			throw new SystemError(`commit data is failed: ${e?.response?.data?.message || e.message}`);
		}
	}
}
