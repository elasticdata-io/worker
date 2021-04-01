import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';
import { TaskSdkModule } from '../sdk/task/task.sdk.module';

@Module({
	imports: [TaskSdkModule],
	providers: [
		{
			provide: PipelineBuilderFactory,
			useClass: PipelineBuilderFactory,
		},
		PipelineService,
	],
	controllers: [PipelineController],
	exports: [PipelineService],
})
export class PipelineModule {
}
