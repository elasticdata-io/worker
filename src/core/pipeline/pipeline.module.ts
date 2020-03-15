import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
		}),
	],
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
