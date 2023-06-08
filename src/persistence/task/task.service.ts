import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
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

  async remove(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
