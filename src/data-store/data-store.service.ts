import { Injectable } from '@nestjs/common';
import { KeyValueData } from './dto/key.value.data';
import { StorageService } from './storage-service';
import {KeyFileData} from "./dto/key.file.data";
import {DataResult} from "./dto/data.result";
import {CommitDocument} from "./dto/commit.document";
import {AttachFile} from "./dto/attach.file";
import {DataRuleService} from "./rule/data-rule.service";
import {KeyData} from "./dto/key.data";
import {DynamicLinkService} from "./dynamic-link-service";
import { KeysValuesData } from './dto/keys.values.data';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class DataStoreService {

	private readonly _storages: any;

	constructor(
		private dataRuleService: DataRuleService,
		private readonly dynamicLinkService: DynamicLinkService,
		private moduleRef: ModuleRef,
	) {
		this._storages = {};
	}

	private async resolveStorage(storageId: string): Promise<StorageService> {
		let storage = this._storages[storageId];
		if (!storage) {
			storage = this._storages[storageId] = this.moduleRef.resolve<StorageService>(StorageService);
		}
		return storage;
	}

	public async putAll(data: KeysValuesData): Promise<void> {
		const storage = await this.resolveStorage(data.id);
		return storage.putAll(data);
	}

	public async put(data: KeyValueData): Promise<void> {
		const storage = await this.resolveStorage(data.id);
		return storage.put(data);
	}

	public async get(data: KeyData): Promise<string> {
		const storage = await this.resolveStorage(data.id);
		return storage.get(data);
	}

	public async remove(data: KeyData): Promise<any> {
		const storage = await this.resolveStorage(data.id);
		return storage.remove(data);
	}

	public async putFile(data: KeyFileData): Promise<string> {
		const storage = await this.resolveStorage(data.id);
		return storage.putFile(data);
	}

	public async attachFile(data: AttachFile): Promise<string> {
		const storage = await this.resolveStorage(data.id);
		return storage.attachFile(data);
	}

	public async commit(data: CommitDocument): Promise<DataResult> {
		const storage = await this.resolveStorage(data.storeId);
		return storage.commit(data);
	}

	public async setDataRules(rulesConfigs: Array<{cmd: string, bindKey: string}>, storageId: string): Promise<void> {
		const dataRules = this.dataRuleService.getDataRules(rulesConfigs);
		if (!dataRules || dataRules.length === 0) {
			return;
		}
		const storage = await this.resolveStorage(storageId);
		if (!storage) {
			return;
		}
		storage.setDataRules(dataRules);
	}

	public async replaceMacros(data: { inputWithMacros: string, context: string, id: string }): Promise<any> {
		const storage = await this.resolveStorage(data.id);
		const config = {
			inputWithMacros: data.inputWithMacros,
			context: data.context,
		};
		return storage.getByMacros(config);
	}
}
