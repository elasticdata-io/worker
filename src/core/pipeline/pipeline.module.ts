import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [],
	providers: [
		{
			provide: PipelineBuilderFactory,
			useClass: PipelineBuilderFactory,
		},
	],
	exports: [PipelineBuilderFactory],
})
export class PipelineModule {
}
