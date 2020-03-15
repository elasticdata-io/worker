import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DataStoreService } from './data-store.service';
import { KeyValueData } from './dto/key-value-data';

@Controller('store')
export class DataStoreController {
	constructor(private readonly dataStoreService: DataStoreService) {
	}

	@Post()
	async put(@Body() data: KeyValueData): Promise<void> {
		return this.dataStoreService.put(data);
	}


	@Get(':storageId')
	async getDocument(@Param('storageId') storageId): Promise<void> {
		return this.dataStoreService.getDocument(storageId);
	}
}
