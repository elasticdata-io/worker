import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDataClient } from './task.data.client';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
		}),
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
