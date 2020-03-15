import { Injectable, Scope } from '@nestjs/common';
import { KeyValueData } from './dto/key-value-data';
import { StorageService } from './storage-service';

@Injectable()
export class DataStoreService {

	private readonly _storages: any;

	constructor() {
		this._storages = {};
	}

	async put(data: KeyValueData): Promise<void> {
		const storage = await this.resolveStorage(data.id);
		return storage.put(data.key, data.value, data.context);
	}

	async getDocument(storageId: string): Promise<void> {
		const storage = await this.resolveStorage(storageId);
		return storage.getDocument();
	}

	private async resolveStorage(id: string): Promise<StorageService> {
		let storage = this._storages[id];
		if (!storage) {
			storage =  this._storages[id] = new StorageService();
		}
		return storage;
	}
}
