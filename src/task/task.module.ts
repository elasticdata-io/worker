import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDataClient } from './task.data.client';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
	],
	controllers: [],
	providers: [
		TaskService,
		TaskDataClient,
	],
	exports: [TaskService]
})
export class TaskModule {
}
