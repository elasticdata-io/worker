import { Injectable } from '@nestjs/common';
import { TaskDataClient } from './task.data.client';

@Injectable()
export class TaskService {

	constructor(private _taskDataClient: TaskDataClient) {
	}

	public async update(taskId: string, patch: any): Promise<void> {
		await this._taskDataClient.update(taskId, patch);
	}
}
