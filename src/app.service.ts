import { Injectable } from '@nestjs/common';
import { PipelineBuilderFactory } from './core/pipeline/pipeline-builder-factory';

@Injectable()
export class AppService {
	constructor(private _pipelineBuilderFactory: PipelineBuilderFactory) {}

	async runPipeline(json: string): Promise<any> {
		const pipelineBuilder = await this._pipelineBuilderFactory.resolve();
		const pipelineProcess = await pipelineBuilder
		  .setPipelineJson(JSON.stringify(json))
		  .build();
		await pipelineProcess.run();
		return pipelineProcess.getDocument();
	}
}
