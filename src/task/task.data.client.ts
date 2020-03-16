import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskDataClient {

	private readonly _serviceUrl: string;

	constructor(private configService: ConfigService) {
		this._serviceUrl = this.configService.get<string>('SCRAPER_SERVICE_URL');
	}

	async update(taskId: string, patch: any): Promise<void> {
		const url = `${this._serviceUrl}/api/task/${taskId}`;
		await axios.patch(`${url}`, patch);
	}
}
