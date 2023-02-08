import { Module } from '@nestjs/common';
import { TaskDataClientSdk } from './task.data.client.sdk';

@Module({
  imports: [],
  controllers: [],
  providers: [TaskDataClientSdk],
  exports: [TaskDataClientSdk],
})
export class TaskSdkModule {}
