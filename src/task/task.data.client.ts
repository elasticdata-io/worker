import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {TaskDto} from "../dto/task.dto";

@Injectable()
export class TaskDataClient {

	private readonly _serviceUrl: string;

	constructor(private configService: ConfigService) {
		this._serviceUrl = this.configService.get<string>('SCRAPER_SERVICE_URL');
	}

	async update(taskId: string, patch: any): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/task/${taskId}`;
		await axios.patch(`${url}`, patch);
	}

	async get(taskId: string): Promise<TaskDto> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/task/${taskId}`;
		const response = await axios.get(`${url}`) || {data: {}};
		return response.data as TaskDto;
	}

	async synchronizeWithPipeline(taskId: string): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/pipeline/task/synchronize/${taskId}`;
		await axios.post(`${url}`);
	}
}
