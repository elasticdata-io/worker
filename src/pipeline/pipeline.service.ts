import { Injectable } from '@nestjs/common';
import { TaskResult } from './data/dto/task.result';
import { TaskDataClientSdk } from '../sdk/task/task.data.client.sdk';
import { PipelineProcess } from './pipeline-process';
import { Environment } from './environment';
import * as moment from 'moment';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { ConfigService } from '@nestjs/config';
import { EnvConfiguration } from '../env/env.configuration';
import { SystemError } from './command/exception/system-error';
import {
  RunTaskDto,
  TaskDto,
  TaskCompeteDto,
  TaskErrorDto,
  DisableUserInteractionStateDto,
  ExecuteCmdDto,
} from '../dto';
import { UserInteractionEvent } from './event-bus';

@Injectable()
export class PipelineService {
  private _currentTaskId: string;
  private _pipelineProcess: PipelineProcess;

  constructor(
    private pipelineBuilderFactory: PipelineBuilderFactory,
    private configService: ConfigService,
    private taskDataClientSdk: TaskDataClientSdk,
    private readonly appEnv: EnvConfiguration,
  ) {}

  public async getCurrentTask(): Promise<TaskDto> {
    if (this._currentTaskId) {
      return await this.taskDataClientSdk.get(this._currentTaskId);
    }
    return {} as TaskDto;
  }

  public async run(dto: RunTaskDto): Promise<TaskResult> {
    if (this._currentTaskId) {
      throw new SystemError(`Another task has been started: ${this._currentTaskId}.
			 Wait for the task to complete and try again`);
    }
    try {
      dto = this.appEnv.USE_ISOLATION_MODE ? RunTaskDto.fillEmpty(dto) : dto;
      this._currentTaskId = dto.taskId;
      console.log(dto);
      if (this.appEnv.USE_ISOLATION_MODE === false) {
        const task: TaskDto = await this.taskDataClientSdk.get(
          this._currentTaskId,
        );
        const isTaskStopping = await this.isTaskStopping(task);
        if (isTaskStopping) {
          await this.stopTask(dto.taskId);
          return;
        }
        const isTaskSuspended = await this.isTaskSuspended(task);
        if (isTaskSuspended) {
          return;
        }
      }
      return await this.runTask(dto);
    } catch (e) {
      if (this._pipelineProcess?.isAborted) {
        return;
      }
      await this.handleErrorOfTask(dto.taskId, e);
      this._pipelineProcess = null;
      this._currentTaskId = null;
      throw e;
    } finally {
      this._pipelineProcess = null;
      this._currentTaskId = null;
    }
  }

  public async stop(taskId?: string): Promise<boolean> {
    try {
      return await this.stopTask(taskId);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async disableInteractionMode(
    dto: DisableUserInteractionStateDto,
  ): Promise<void> {
    if (this._currentTaskId !== dto.taskId) {
      return;
    }
    await this._pipelineProcess.eventBus.emit(
      UserInteractionEvent.DISABLE_USER_INTERACTION_MODE,
      dto,
    );
  }

  public async executeCommand(dto: ExecuteCmdDto): Promise<void> {
    if (this._currentTaskId !== dto.taskId) {
      return;
    }
    await this._pipelineProcess.eventBus.emit(
      UserInteractionEvent.EXECUTE_CMD,
      dto,
    );
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

  private async stopTask(taskId?: string): Promise<boolean> {
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
    const pipelineBuilder = await this.pipelineBuilderFactory.resolve();
    let json: string =
      typeof dto.json === 'string' ? dto.json : JSON.stringify(dto.json);
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
    return {
      ...data,
      taskInformation: taskInformation,
    };
  }

  private async handleTaskStopped(
    taskId: string,
    taskResult?: TaskResult,
  ): Promise<void> {
    if (typeof taskId !== 'string') {
      throw new Error('taskId must by string');
    }
    if (this.appEnv.USE_ISOLATION_MODE) {
      return;
    }
    let patch: any[] = [
      {
        op: 'replace',
        path: '/status',
        value: 'stopped',
      },
      {
        op: 'replace',
        path: '/endOnUtc',
        value: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      },
    ];
    if (taskResult) {
      patch = [
        ...patch,
        {
          op: 'replace',
          path: '/docsUrl',
          value: taskResult?.fileLink,
        },
        {
          op: 'replace',
          path: '/docsCount',
          value: taskResult?.rootLines || 0,
        },
        {
          op: 'replace',
          path: '/docsBytes',
          value: taskResult?.bytes,
        },
        {
          op: 'replace',
          path: '/commandsInformationLink',
          value: taskResult?.taskInformation?.commandsInformationLink,
        },
      ];
    }
    await this.taskDataClientSdk.update(taskId, patch);
    console.log(`handleTaskStopped, taskId: ${taskId}`);
  }

  private _onPipelineEvents(pipelineProcess: PipelineProcess): void {
    pipelineProcess.interactionStateChanged$.subscribe(async (state) => {
      if (this.appEnv.USE_ISOLATION_MODE === false) {
        await this.taskDataClientSdk.updateUserInteraction(state);
      }
    });
    pipelineProcess.startExecuteCommand$.subscribe(async (command) => {
      if (this.appEnv.USE_ISOLATION_MODE === false) {
        await this.taskDataClientSdk.notifyStartCommandExecute(command);
      }
    });
  }

  private async beforeRunTask(taskId: string): Promise<void> {
    if (this.appEnv.USE_ISOLATION_MODE) {
      return;
    }
    const patch = [
      {
        op: 'replace',
        path: '/status',
        value: 'running',
      },
      {
        op: 'replace',
        path: '/runOnUtc',
        value: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      },
    ];
    await this.taskDataClientSdk.update(taskId, patch);
  }

  private async afterRunTask(
    taskId: string,
    taskResult: TaskResult,
  ): Promise<void> {
    if (this.appEnv.USE_ISOLATION_MODE) {
      return;
    }
    const taskCompleteDto: TaskCompeteDto = {
      id: taskId,
      docsUrl: taskResult.fileLink,
      docsCount: taskResult.rootLines,
      docsBytes: taskResult.bytes,
      commandsInformationLink:
        taskResult.taskInformation.commandsInformationLink,
    };
    const taskErrorDto: TaskErrorDto = {
      id: taskId,
      docsUrl: taskResult.fileLink,
      docsCount: taskResult.rootLines,
      docsBytes: taskResult.bytes,
      commandsInformationLink:
        taskResult.taskInformation.commandsInformationLink,
      failureReason: taskResult.taskInformation.failureReason,
    };
    if (taskResult.taskInformation.failureReason) {
      await this.taskDataClientSdk.error(taskErrorDto);
    } else {
      await this.taskDataClientSdk.complete(taskCompleteDto);
    }
  }

  private async handleErrorOfTask(
    taskId: string,
    error: string,
  ): Promise<void> {
    if (this.appEnv.USE_ISOLATION_MODE) {
      console.error(error);
      return;
    }
    const dto: TaskErrorDto = {
      id: taskId,
      docsUrl: null,
      commandsInformationLink: null,
      docsCount: 0,
      docsBytes: 0,
      failureReason: error.toString(),
    };
    await this.taskDataClientSdk.error(dto);
  }
}
