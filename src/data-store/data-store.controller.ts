import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DataStoreService } from './data-store.service';
import { KeyValueData } from './dto/key.value.data';

@Controller('/v1/store')
export class DataStoreController {
	constructor(private readonly dataStoreService: DataStoreService) {
	}

	@Post()
	async put(@Body() data: KeyValueData): Promise<any> {
		try {
			await this.dataStoreService.put(data);
		} catch (e) {
			return {
				success: false,
				message: e
			}
		}
		return {
			success: true
		}
	}

	@Get('keys')
	async keys(): Promise<string[]> {
		return this.dataStoreService.keys();
	}

	@Get('count')
	async count(): Promise<number> {
		return this.dataStoreService.count();
	}

	@Get(':storageId')
	async getDocument(@Param('storageId') storageId): Promise<void> {
		return this.dataStoreService.getDocument(storageId);
	}
}
