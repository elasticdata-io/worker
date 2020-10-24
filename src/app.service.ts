import * as moment from 'moment';
import {Injectable} from '@nestjs/common';
import {PipelineBuilderFactory} from './core/pipeline/pipeline-builder-factory';
import {Environment} from './core/pipeline/environment';
import {TaskService} from './task/task.service';
import {RunTaskDto} from './dto/run.task.dto';
import {TaskResult} from './core/pipeline/data/dto/task.result';
import {PipelineProcess} from './core/pipeline/pipeline-process';
import {ConfigService} from '@nestjs/config';
import {TaskDto} from "./dto/task.dto";
import {ExecuteCmdDto} from "./dto/execute-cmd.dto";

@Injectable()
export class AppService {
	private _pipelineProcess: PipelineProcess;
	private readonly USE_SIMPLE_WORKER: boolean;
	private _currentTaskId: string;

	constructor(
		private _pipelineBuilderFactory: PipelineBuilderFactory,
		private _taskService: TaskService,
		private _configService: ConfigService,
	) {
		this.USE_SIMPLE_WORKER = this._configService.get<string>('USE_SIMPLE_WORKER') === '1';
	}

	public async stopPipelineTask(taskId?: string): Promise<boolean> {
		try {
			return await this.stopTask(taskId);
		} catch (e) {
			console.error(e);
			throw e
		}
		return false;
	}

	public async runPipelineTask(dto: RunTaskDto): Promise<TaskResult> {
		try {
			this._currentTaskId = dto.taskId;
			const task: TaskDto = await this.getTaskDto(this._currentTaskId);
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
			if (this._pipelineProcess) {
				await this.handleErrorOfTask(dto.taskId, e);
			}
			throw e
		}
	}

	public async executeCommand(dto: ExecuteCmdDto): Promise<void> {
		if (this._currentTaskId !== dto.taskId) {
			return;
		}
		await this._pipelineProcess.executeCommandsFromInteraction(dto);
	}

	private async getTaskDto(taskId: string): Promise<TaskDto> {
		return await this._taskService.get(taskId);
	}

	private async isTaskSuspended(taskDto: TaskDto): Promise<boolean> {
		if (!taskDto) {
			return true;
		}
		return TaskDto.isTaskSuspended(taskDto);
	}

	private async isTaskStopping(taskDto: TaskDto): Promise<boolean> {
		if (!taskDto) {
			return false;
		}
		return TaskDto.isTaskStopping(taskDto);
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

	private _onPipelineEvents(pipelineProcess: PipelineProcess): void {
		pipelineProcess.interactionStateChanged$.subscribe(async (state) => {
			await this._taskService.changeUserInteractionMode(state);
		});
		pipelineProcess.startExecuteCommand$.subscribe(async (command) => {
			await this._taskService.notifyStartCommandExecute(command);
		});
	}

	private async beforeRunTask(taskId: string): Promise<void> {
		if (this.USE_SIMPLE_WORKER) {
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
		await this._taskService.update(taskId, patch);
	}

	private async afterRunTask(taskId: string, taskResult: TaskResult): Promise<void> {
		if (this.USE_SIMPLE_WORKER) {
			return;
		}
		const taskStatus = taskResult.taskInformation.failureReason
		  ? 'error'
		  : 'completed';
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: taskStatus,
			},
			{
				op: "replace",
				path: "/docsUrl",
				value: taskResult.fileLink
			},
			{
				op: "replace",
				path: "/docsCount",
				value: taskResult.rootLines || 0
			},
			{
				op: "replace",
				path: "/docsBytes",
				value: taskResult.bytes
			},
			{
				op: "replace",
				path: "/commandsInformationLink",
				value: taskResult.taskInformation.commandsInformationLink,
			},
			{
				op: "replace",
				path: "/endOnUtc",
				value: moment().utc().format('YYYY-MM-DD HH:mm:ss')
			}
		];
		await this._taskService.update(taskId, patch);
		await this._taskService.synchronizeWithPipeline(taskId);
	}

	private async handleErrorOfTask(taskId: string, error: string): Promise<void> {
		if (this.USE_SIMPLE_WORKER) {
			console.error(error);
			return;
		}
		const patch = [
			{
				op: "replace",
				path: "/status",
				value: 'error'
			},
			{
				op: "replace",
				path: "/endOnUtc",
				value: moment().utc().format('YYYY-MM-DD HH:mm:ss')
			},
			{
				op: "replace",
				path: "/failureReason",
				value: error.toString()
			}
		];
		await this._taskService.update(taskId, patch);
	}

	private async handleTaskStopped(taskId: string, taskResult?: TaskResult): Promise<void> {
		if (this.USE_SIMPLE_WORKER) {
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
		await this._taskService.update(taskId, patch);
		console.log(`handleTaskStopped, taskId: ${taskId}`);
	}

}
