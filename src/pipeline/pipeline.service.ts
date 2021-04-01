import { Injectable } from '@nestjs/common';
import { RunTaskDto } from '../dto/run.task.dto';
import { TaskResult } from './data/dto/task.result';
import { TaskDto } from '../dto/task.dto';
import { TaskDataClientSdk } from '../sdk/task/task.data.client.sdk';
import { PipelineProcess } from './pipeline-process';
import { Environment } from './environment';
import * as moment from 'moment';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { ConfigService } from '@nestjs/config';
import { TaskCompeteDto } from '../dto/task-compete.dto';
import { TaskErrorDto } from '../dto/task-error.dto';

@Injectable()
export class PipelineService {
	private readonly USE_ISOLATION_MODE: boolean;
	private _currentTaskId: string;
	private _pipelineProcess: PipelineProcess;

	constructor(
		private _pipelineBuilderFactory: PipelineBuilderFactory,
		private _configService: ConfigService,
		private _taskDataClientSdk: TaskDataClientSdk,
	) {
		this.USE_ISOLATION_MODE = this._configService.get<string>('USE_ISOLATION_MODE') === '1';
	}

	public async runPipeline(dto: RunTaskDto): Promise<TaskResult> {
		try {
			this._currentTaskId = dto.taskId;
			const task: TaskDto = await this._taskDataClientSdk.get(this._currentTaskId);
			const isTaskStopping = await this.isTaskStopping(task);
			if (isTaskStopping) {
				await this.stopTask(this._currentTaskId);
				return;
			}
			const isTaskSuspended = await this.isTaskSuspended(task);
			if (isTaskSuspended) {
				return;
			}
			return await this.runTask(dto);
		} catch (e) {
			if (this._pipelineProcess?.isAborted) {
				return;
			}
			await this.handleErrorOfTask(dto.taskId, e);
			throw e
		}
	}

	public async stopPipeline(taskId?: string): Promise<boolean> {
		try {
			return await this.stopTask(taskId);
		} catch (e) {
			console.error(e);
			throw e
		}
		return false;
	}

	private async isTaskSuspended(taskDto: TaskDto): Promise<boolean> {
		if (taskDto) {
			return TaskDto.isTaskSuspended(taskDto);
		}
		return true;
	}

	private async isTaskStopping(taskDto: TaskDto): Promise<boolean> {
		if (taskDto) {
			return TaskDto.isTaskStopping(taskDto);
		}
		return false;
	}

	private async stopTask(taskId?: string): Promise<boolean>  {
		if (!taskId || this._currentTaskId === taskId) {
			if (!this._pipelineProcess) {
				return false;
			}
			const taskInformation = await this._pipelineProcess.abort();
			await this._pipelineProcess.destroy();
			const resultData = await this._pipelineProcess.commit();
			await this.handleTaskStopped(taskId, {
				...resultData,
				taskInformation,
			});
			return true;
		} else if (this._currentTaskId !== taskId) {
			await this.handleTaskStopped(taskId);
			return true;
		}
		return false;
	}

	private async runTask(dto: RunTaskDto): Promise<TaskResult> {
		await this.beforeRunTask(dto.taskId);
		const env = {
			userUuid: dto.userUuid,
			taskId: dto.taskId,
			pipelineId: dto.pipelineId,
		} as Environment;
		const pipelineBuilder = await this._pipelineBuilderFactory.resolve();
		let json: string = dto.json;
		if (typeof json === 'object') {
			json = JSON.stringify(dto.json, null, 4);
		}
		console.log(JSON.parse(json));
		console.log(dto.proxies);
		this._pipelineProcess = await pipelineBuilder
			.setEnvironment(env)
			.setPipelineJson(json)
			.setProxies(dto.proxies)
			.build();
		this._onPipelineEvents(this._pipelineProcess);
		const taskInformation = await this._pipelineProcess.run();
		if (this._pipelineProcess.isAborted) {
			await this._pipelineProcess.destroy();
			return {} as TaskResult;
		}
		const data = await this._pipelineProcess.commit();
		await this.afterRunTask(dto.taskId, {
			...data,
			taskInformation: taskInformation,
		});
		await this._pipelineProcess.destroy();
		if (taskInformation.failureReason) {
			throw taskInformation.failureReason;
		}
		return data;
	}

	private async handleTaskStopped(taskId: string, taskResult?: TaskResult): Promise<void> {
		if (typeof taskId !== 'string') {
			throw new Error('taskId must by string')
		}
		if (this.USE_ISOLATION_MODE) {
			return;
		}
		let patch: any[] = [
			{
				op: "replace",
				path: "/status",
				value: 'stopped'
			},
			{
				op: "replace",
				path: "/endOnUtc",
				value: moment().utc().format('YYYY-MM-DD HH:mm:ss')
			}
		];
		if (taskResult) {
			patch = [
				...patch,
				{
					op: "replace",
					path: "/docsUrl",
					value: taskResult?.fileLink
				},
				{
					op: "replace",
					path: "/docsCount",
					value: taskResult?.rootLines || 0
				},
				{
					op: "replace",
					path: "/docsBytes",
					value: taskResult?.bytes
				},
				{
					op: "replace",
					path: "/commandsInformationLink",
					value: taskResult?.taskInformation?.commandsInformationLink,
				},
			];
		}
		await this._taskDataClientSdk.update(taskId, patch);
		console.log(`handleTaskStopped, taskId: ${taskId}`);
	}

	private _onPipelineEvents(pipelineProcess: PipelineProcess): void {
		pipelineProcess.interactionStateChanged$.subscribe(async (state) => {
			await this._taskDataClientSdk.updateUserInteraction(state);
		});
		pipelineProcess.startExecuteCommand$.subscribe(async (command) => {
			await this._taskDataClientSdk.notifyStartCommandExecute(command);
		});
	}

	private async beforeRunTask(taskId: string): Promise<void> {
		if (this.USE_ISOLATION_MODE) {
			return;
		}
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: 'running'
			},
			{
				op: "replace",
				path: "/runOnUtc",
				value: moment().utc().format('YYYY-MM-DD HH:mm:ss')
			}
		];
		await this._taskDataClientSdk.update(taskId, patch);
	}

	private async afterRunTask(taskId: string, taskResult: TaskResult): Promise<void> {
		if (this.USE_ISOLATION_MODE) {
			return;
		}
		const taskCompleteDto: TaskCompeteDto = {
			id: taskId,
			docsUrl: taskResult.fileLink,
			docsCount: taskResult.rootLines,
			docsBytes: taskResult.bytes,
			commandsInformationLink: taskResult.taskInformation.commandsInformationLink,
		};
		const taskErrorDto: TaskErrorDto = {
			id: taskId,
			docsUrl: taskResult.fileLink,
			docsCount: taskResult.rootLines,
			docsBytes: taskResult.bytes,
			commandsInformationLink: taskResult.taskInformation.commandsInformationLink,
			failureReason: taskResult.taskInformation.failureReason,
		};
		if (taskResult.taskInformation.failureReason) {
			await this._taskDataClientSdk.error(taskErrorDto);
		} else {
			await this._taskDataClientSdk.complete(taskCompleteDto);
		}
	}

	private async handleErrorOfTask(taskId: string, error: string): Promise<void> {
		if (this.USE_ISOLATION_MODE) {
			console.error(error);
			return;
		}
		const dto: TaskErrorDto = {
			id: taskId,
			docsUrl: null,
			commandsInformationLink: null,
			docsCount: 0,
			docsBytes: 0,
			failureReason: error.toString()
		};
		await this._taskDataClientSdk.error(dto);
	}
}