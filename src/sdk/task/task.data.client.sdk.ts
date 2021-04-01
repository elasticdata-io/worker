import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {TaskDto} from "../../dto/task.dto";
import {TaskCommandExecuteDto} from "../../dto/task.command.execute.dto";
import {UserInteractionState} from "../../pipeline/user-interaction";
import { TaskCompeteDto } from 'src/dto/task-compete.dto';
import {TaskErrorDto} from "../../dto/task-error.dto";

@Injectable()
export class TaskDataClientSdk {

	private readonly _serviceUrl: string;

	constructor(private configService: ConfigService) {
		this._serviceUrl = this.configService.get<string>('SCRAPER_SERVICE_URL');
	}

	async error(dto: TaskErrorDto): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/task/error`;
		await axios.post(`${url}`, dto);
	}

	async complete(dto: TaskCompeteDto): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/task/complete`;
		await axios.post(`${url}`, dto);
	}

	async update(taskId: string, patch: any): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		if (typeof taskId !== 'string') {
			throw new Error('taskId must be string')
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

	async notifyStartCommandExecute(dto: TaskCommandExecuteDto): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/task/notify/start-command-execute`;
		await axios.post(`${url}`, dto);
	}

	async updateUserInteraction(dto: UserInteractionState): Promise<void> {
		if (parseInt(this._serviceUrl) === 0) {
			return;
		}
		const url = `${this._serviceUrl}/api/task-user-interaction`;
		await axios.post(`${url}`, dto);
	}
}
