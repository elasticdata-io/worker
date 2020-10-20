import { Injectable } from '@nestjs/common';
import { TaskDataClient } from './task.data.client';
import {TaskDto} from "../dto/task.dto";
import {TaskCommandExecuteDto} from "../dto/task.command.execute.dto";
import {EnableUserInteractionStateDto} from "../dto/enable-user-interaction-state.dto";

@Injectable()
export class TaskService {

	constructor(private _taskDataClient: TaskDataClient) {}

	public async update(taskId: string, patch: any): Promise<void> {
		await this._taskDataClient.update(taskId, patch);
	}

	public async get(taskId: string): Promise<TaskDto> {
		return await this._taskDataClient.get(taskId);
	}

	public async synchronizeWithPipeline(taskId: string): Promise<void> {
		await this._taskDataClient.synchronizeWithPipeline(taskId);
	}

	public async notifyStartCommandExecute(dto: TaskCommandExecuteDto): Promise<void> {
		await this._taskDataClient.notifyStartCommandExecute(dto);
	}

	public async enableUserInteractionMode(dto: EnableUserInteractionStateDto): Promise<void> {
		await this._taskDataClient.enableUserInteractionMode(dto);
	}
}
