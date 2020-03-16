import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { PipelineBuilderFactory } from './core/pipeline/pipeline-builder-factory';
import { Environment } from './core/pipeline/environment';
import { TaskService } from './task/task.service';
import { RunTaskDto } from './dto/run.task';

@Injectable()
export class AppService {
	constructor(private _pipelineBuilderFactory: PipelineBuilderFactory,
				private _taskService: TaskService) {}

	async runPipeline(dto: RunTaskDto): Promise<string> {
		this.beforeRunPipeline(dto.taskId);
		const env = { userUuid: dto.userUuid } as Environment;
		const pipelineBuilder = await this._pipelineBuilderFactory.resolve();
		const pipelineProcess = await pipelineBuilder
		  .setEnvironment(env)
		  .setPipelineJson(JSON.stringify(dto.json))
		  .build();
		await pipelineProcess.run();
		const fileLink = await pipelineProcess.commit();
		await pipelineProcess.destroy();
		await this.afterRunPipeline(dto.taskId, fileLink);
		return fileLink;
	}

	async beforeRunPipeline(taskId: string): Promise<void> {
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

	async afterRunPipeline(taskId: string, fileLink: string): Promise<void> {
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: 'completed'
			},
			{
				op: "replace",
				path: "/docsUrl",
				value: fileLink
			},
			{
				op: "replace",
				path: "/docsCount",
				value: 0
			},
			{
				op: "replace",
				path: "/endOnUtc",
				value: moment().format('YYYY-MM-DD HH:mm:ss')
			}
		];
		await this._taskService.update(taskId, patch);
	}
}
