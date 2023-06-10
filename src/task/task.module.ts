import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { EnvModule } from '../env/env.module';
import { TaskPersistenceModule } from '../persistence';

@Module({
  imports: [EnvModule, TaskPersistenceModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
