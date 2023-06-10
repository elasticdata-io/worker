import { Injectable } from '@nestjs/common';
import { TaskEntity } from '../persistence';
import { TaskPersistenceService } from '../persistence';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskPersistenceService: TaskPersistenceService,
  ) {}

  public async create(task: TaskEntity): Promise<TaskEntity> {
    return this.taskPersistenceService.create(task);
  }

  public async complete(task: Partial<TaskEntity>): Promise<TaskEntity> {
    return this.taskPersistenceService.updateStatus({
      id: task.id,
      status: 'completed',
    });
  }

  public async abort(task: Partial<TaskEntity>): Promise<TaskEntity> {
    return this.taskPersistenceService.updateStatus({
      id: task.id,
      status: 'stopped',
    });
  }

  public async error(
    task: Partial<TaskEntity>,
    failReason: string,
  ): Promise<TaskEntity> {
    return this.taskPersistenceService.updateStatus({
      id: task.id,
      status: 'error',
      failReason: failReason,
    });
  }
}
