import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { PipelineBuilderFactory } from './core/pipeline/pipeline-builder-factory';
import { Environment } from './core/pipeline/environment';
import { TaskService } from './task/task.service';
import { RunTaskDto } from './dto/run.task';
import { DataResult } from './core/pipeline/data/dto/data.result';

@Injectable()
export class AppService {
	constructor(private _pipelineBuilderFactory: PipelineBuilderFactory,
				private _taskService: TaskService) {}

	public async runPipelineTask(dto: RunTaskDto): Promise<DataResult> {
		try {
			return await this.runTask(dto);
		} catch (e) {
			await this.handleErrorOfTask(dto.taskId, e);
			throw e
		}
	}

	private async runTask(dto: RunTaskDto): Promise<DataResult> {
		this.beforeRunTask(dto.taskId);
		const env = {
			userUuid: dto.userUuid,
			taskId: dto.taskId
		} as Environment;
		const pipelineBuilder = await this._pipelineBuilderFactory.resolve();
		console.log(JSON.parse(dto.json));
		const pipelineProcess = await pipelineBuilder
		  .setEnvironment(env)
		  .setPipelineJson(dto.json)
		  .setProxies(dto.proxies)
		  .build();
		await pipelineProcess.run();
		const data = await pipelineProcess.commit();
		await pipelineProcess.destroy();
		await this.afterRunTask(dto.taskId, data);
		return data;
	}

	private async beforeRunTask(taskId: string): Promise<void> {
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: 'running'
			},
			{
				op: "replace",
				path: "/runOnUtc",
				value: moment().format('YYYY-MM-DD HH:mm:ss')
			}
		];
		await this._taskService.update(taskId, patch);
	}

	private async afterRunTask(taskId: string, data: DataResult): Promise<void> {
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: 'completed'
			},
			{
				op: "replace",
				path: "/docsUrl",
				value: data.fileLink
			},
			{
				op: "replace",
				path: "/docsCount",
				value: data.rootLines || 0
			},
			{
				op: "replace",
				path: "/docsBytes",
				value: data.bytes
			},
			{
				op: "replace",
				path: "/endOnUtc",
				value: moment().format('YYYY-MM-DD HH:mm:ss')
			}
		];
		await this._taskService.update(taskId, patch);
		await this._taskService.synchronizeWithPipeline(taskId);
	}

	private async handleErrorOfTask(taskId: string, error: string): Promise<void> {
		console.log(`handleErrorOfTask, taskId: ${taskId}`);
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: 'error'
			},
			{
				op: "replace",
				path: "/endOnUtc",
				value: moment().format('YYYY-MM-DD HH:mm:ss')
			},
			{
				op: "replace",
				path: "/failureReason",
				value: error.toString()
			}
		];
		await this._taskService.update(taskId, patch);
	}
}
