import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { PipelineService } from './pipeline.service';
import { PipelineController } from './pipeline.controller';
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
		PipelineService,
	],
	controllers: [PipelineController],
	exports: [PipelineService],
})
export class PipelineModule {
}
