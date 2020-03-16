import { Injectable } from '@nestjs/common';
import { PipelineBuilderFactory } from './core/pipeline/pipeline-builder-factory';
import { Environment } from './core/pipeline/environment';

@Injectable()
export class AppService {
	constructor(private _pipelineBuilderFactory: PipelineBuilderFactory) {}

	async runPipeline(json: string, userUuid: string): Promise<any> {
		const env = { userUuid: userUuid } as Environment;
		const pipelineBuilder = await this._pipelineBuilderFactory.resolve();
		const pipelineProcess = await pipelineBuilder
		  .setEnvironment(env)
		  .setPipelineJson(JSON.stringify(json))
		  .build();
		await pipelineProcess.run();
		return pipelineProcess.getDocument();
	}
}
