import { v4 as uuidv4 } from 'uuid';
import { unflatten } from 'flat'
import { ContextValidator } from './context-validator';
import { ConfigService } from "@nestjs/config";
import { KeyValueData } from "./dto/key.value.data";
import { KeyFileData } from "./dto/key.file.data";
import {DataResult} from "./dto/data.result";
import {CommitDocument} from "./dto/commit.document";
import {AttachFile} from "./dto/attach.file";
import AbstractDataRuleCommand from "./rule/abstract-data-rule.command";
import {KeyData} from "./dto/key.data";
import { KeysValuesData } from './dto/keys.values.data';
import { Injectable, Scope } from '@nestjs/common';
import { AbstractFileClientService } from './abstract-file-client.service';
import { AbstractDynamicLinkService } from './abstract-dynamic-link.service';
import { MacrosParser, TaskDataStoreContext } from './index';

@Injectable({ scope: Scope.TRANSIENT })
export class StorageService {

	private _dataRules: AbstractDataRuleCommand[] = [];
	private _contexts: TaskDataStoreContext;

	constructor(
		private readonly configService: ConfigService,
		private readonly dynamicLinkService: AbstractDynamicLinkService,
		private readonly fileClientService: AbstractFileClientService,
	) {
		this._contexts = {};
	}

	private async _getHumanLink(link: string): Promise<string> {
		return await this.dynamicLinkService.getHumanLink(link);
	}

	private async _upsertLine(context: string, key: string, value: string): Promise<void> {
		if (!this._contexts[context]) {
			this._contexts[context] = this._getContextProxy(this._dataRules);
		}
		return this._setToLine(context, key, value);
	}

	private _getContextProxy(dataRules: AbstractDataRuleCommand[]): ProxyConstructor {
		return new Proxy({}, {
			get (target: any, prop: any) {
				return target[prop];
			},
			set (target: any, prop: any, value: any) {
				target[prop] = value;
				dataRules
					.filter(dataRule => dataRule.isWatchKey(prop))
					.forEach(dataRule => dataRule.apply(prop, target[prop], target))
				return true;
			}
		});
	}

	private async _setToLine(context: string, key: string, value: string): Promise<void> {
		this._contexts[context][key] = value;
	}

	protected async createIfNotExistsBucket(bucket: string): Promise<any> {
		const bucketExists = await this.fileClientService.bucketExists(bucket);
		if (bucketExists) {
			return;
		}
		await this.fileClientService.makeBucket(bucket, 'us-east-1');
	}

	protected async destroy(): Promise<void> {
		this._contexts = {};
	}

	/**
	 * Attach file in user folder with command context.
	 * @param data
	 */
	public async putFile(data: KeyFileData): Promise<string> {
		try {
			ContextValidator.validate(data.context);
			const objectName = `${uuidv4()}.${data.fileExtension}`;
			await this.createIfNotExistsBucket(data.userUuid);
			await this.fileClientService.putObject(data.userUuid, objectName, data.file);
			const fileLink = await this.fileClientService.presignedGetObject(data.userUuid, objectName);
			const link = await this._getHumanLink(fileLink);
			await this._upsertLine(data.context, data.key, link);
			return link;
		} catch (e) {
			console.error(e);
			throw Error(e);
		}
	}

	/**
	 * Attach file without context but in user folder.
	 * Return file public link.
	 * @param data
	 */
	public async attachFile(data: AttachFile): Promise<string> {
		try {
			const objectName = `${uuidv4()}.${data.fileExtension}`;
			await this.createIfNotExistsBucket(data.userUuid);
			await this.fileClientService.putObject(data.userUuid, objectName, data.file, data.metadata);
			const fileLink = await this.fileClientService.presignedGetObject(data.userUuid, objectName);
			return await this._getHumanLink(fileLink);
		} catch (e) {
			console.error(e);
			throw Error(e);
		}
	}

	/**
	 * Put key-value data to store.
	 * @param data
	 */
	public async putAll(data: KeysValuesData): Promise<void> {
		ContextValidator.validate(data.context);
		const context = data.context === 'root.0' ? 'root' : data.context;
		const values = data.values || [];
		if (Array.isArray(values) === false) {
			throw new Error('putAll support only array structure')
		}
		for (const [index, val] of Object.entries(values)) {
			await this._putAll(context, `${index}`, val);
		}
	}

	private async _putAll(context: string, key: string, value: any): Promise<void> {
		if (Array.isArray(value)) {
			for (const [index, val] of Object.entries(value)) {
				await this._putAll(`${context}.${key}`, index, val);
			}
			return;
		}
		if (typeof value === 'object') {
			for (const [objKey, val] of Object.entries(value)) {
				await this._putAll(`${context}.${key}`, objKey, val);
			}
			return;
		}
		await this._upsertLine(context, key, value);
	}

	/**
	 * Put key-value data to store.
	 * @param data
	 */
	public async put(data: KeyValueData): Promise<void> {
		ContextValidator.validate(data.context);
		await this._upsertLine(data.context, data.key, data.value);
	}

	/**
	 * Get value by key from store.
	 * @param data
	 */
	public async get(data: { context: string, key: string }): Promise<any> {
		ContextValidator.validate(data.context);
		const document = this._contexts[data.context] || {};
		console.log(data.key)
		console.log(JSON.stringify(document, null, 4))
		console.log(document[data.key])
		return document[data.key];
	}

	/**
	 * Get value by macros from store.
	 * @param data
	 */
	public async getByMacros(data: { context: string, inputWithMacros: string }): Promise<any> {
		ContextValidator.validate(data.context);
		const stringWithMacros = data.inputWithMacros;
		if (MacrosParser.hasAnyMacros(stringWithMacros)) {
			return MacrosParser.replaceMacros({
				stringWithMacros,
				dataStoreContext: {...this._contexts},
				commandDataContext: data.context,
			});
		}
		return null;
	}

	/**
	 * Remove value by key from store.
	 * @param data
	 */
	public async remove(data: KeyData): Promise<void> {
		ContextValidator.validate(data.context);
		const document = this._contexts[data.context] || {};
		delete document[data.key];
	}

	/**
	 * Freezing all data and return.
	 * @param data
	 */
	public async commit(data: CommitDocument): Promise<DataResult> {
		const document = unflatten(this._contexts) || {root: []};
		const root = document.root || [];
		const contentType = 'application/json;charset=UTF-8';
		const json = JSON.stringify(root, null, 2);
		await this.createIfNotExistsBucket(data.bucket);
		await this.fileClientService.putObject(data.bucket, data.fileName, json, {
			'Content-Type': contentType,
		});
		const fileLink = await this.fileClientService.presignedGetObject(data.bucket, data.fileName);
		const humanLink = await this._getHumanLink(fileLink);
		await this.destroy();
		const fileBytes = Buffer.byteLength(json, 'utf8');
		const rootLines = root.length;
		return {
			fileLink: humanLink,
			bytes: fileBytes,
			rootLines: rootLines,
		};
	}

	/**
	 * Sets data rules, that apply to the putting data.
	 * @param dataRules
	 */
	public setDataRules(dataRules: AbstractDataRuleCommand[]): void {
		this._dataRules = dataRules;
	}
}
