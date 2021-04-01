import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskSdkModule } from '../sdk/task/task.sdk.module';
import { EnvModule } from '../env/env.module';

@Module({
	imports: [
		TaskSdkModule,
		EnvModule,
	],
	providers: [
		{
			provide: PipelineBuilderFactory,
			useClass: PipelineBuilderFactory,
		},
		TaskService,
	],
	controllers: [TaskController],
	exports: [TaskService],
})
export class PipelineModule {
}
