import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDataClient } from './task.data.client';

@Module({
	imports: [],
	controllers: [],
	providers: [
		TaskService,
		TaskDataClient,
	],
	exports: [TaskService]
})
export class TaskModule {
}
