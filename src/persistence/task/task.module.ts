import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskPersistenceService } from './task-persistence.service';
import { TaskEntity } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  providers: [TaskPersistenceService],
  exports: [TaskPersistenceService],
})
export class TaskPersistenceModule {}
