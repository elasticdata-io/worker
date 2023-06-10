import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity, TaskStatus } from './task.entity';

@Injectable()
export class TaskPersistenceService {
  constructor(
    @InjectRepository(TaskEntity)
    private tasksRepository: Repository<TaskEntity>,
  ) {}

  findAll(): Promise<TaskEntity[]> {
    return this.tasksRepository.find();
  }

  findOne(id: string): Promise<TaskEntity | null> {
    return this.tasksRepository.findOneBy({ id });
  }

  async create(entity: Partial<TaskEntity>): Promise<TaskEntity> {
    const result = await this.tasksRepository.insert(entity);
    return result?.raw?.pop();
  }

  async put(entity: TaskEntity): Promise<TaskEntity> {
    const result = await this.tasksRepository.upsert(entity, ['id']);
    return result?.raw?.pop();
  }

  async updateStatus(config: {
    id: string;
    status: TaskStatus;
    failReason?: string;
  }): Promise<TaskEntity> {
    const task = await this.tasksRepository.findOneBy({ id: config.id });
    if (!task) {
      throw new Error(`Task with id:${config.id} not found in DB`);
    }
    task.status = config.status;
    if (
      config.status === 'completed' ||
      config.status === 'stopped' ||
      config.status === 'error'
    ) {
      task.finishedOn = new Date();
    }
    if (config.status === 'running') {
      task.startedOn = new Date();
    }
    if (config.status === 'error') {
      task.failReason = config.failReason;
    }
    await this.tasksRepository.update(task.id, {
      status: task.status,
      finishedOn: task.finishedOn ?? null,
      startedOn: task.startedOn ?? null,
      failReason: task.failReason ?? null,
    });
    return this.findOne(task.id);
  }

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
