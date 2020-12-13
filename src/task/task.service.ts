import { Injectable } from '@nestjs/common';
import { TaskDataClient } from './task.data.client';
import {TaskDto} from "../dto/task.dto";
import {TaskCommandExecuteDto} from "../dto/task.command.execute.dto";
import {UserInteractionState} from "../core/pipeline/user-interaction/interface";
import {TaskCompeteDto} from "../dto/task-compete.dto";
import {TaskErrorDto} from "../dto/task-error.dto";

@Injectable()
export class TaskService {

	constructor(private _taskDataClient: TaskDataClient) {}

	public async error(dto: TaskErrorDto): Promise<void> {
		await this._taskDataClient.error(dto);
	}

	public async complete(dto: TaskCompeteDto): Promise<void> {
		await this._taskDataClient.complete(dto);
	}

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

	public async changeUserInteractionMode(dto: UserInteractionState): Promise<void> {
		await this._taskDataClient.changeUserInteractionMode(dto);
	}
}
