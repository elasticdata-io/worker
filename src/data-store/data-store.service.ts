import { Injectable } from '@nestjs/common';
import { KeyValueData } from './dto/key.value.data';
import { StorageService } from './storage-service';

@Injectable()
export class DataStoreService {

	private readonly _storages: any;

	constructor() {
		this._storages = {};
	}

	public async put(data: KeyValueData): Promise<void> {
		const storage = await this.resolveStorage(data.id);
		return storage.put(data.key, data.value, data.context);
	}
	public async getDocument(storageId: string): Promise<void> {
		const storage = await this.resolveStorage(storageId);
		return storage.getDocument();
	}
	public async count(): Promise<number> {
		return Object.keys(this._storages).length;
	}
	public async keys(): Promise<string[]> {
		return Object.keys(this._storages);
	}

	private async resolveStorage(id: string): Promise<StorageService> {
		let storage = this._storages[id];
		if (!storage) {
			storage =  this._storages[id] = new StorageService();
		}
		return storage;
	}
}
