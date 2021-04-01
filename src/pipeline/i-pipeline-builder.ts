import { PipelineBuilder } from './pipeline-builder';
import { Environment } from './environment';
import { PipelineProcess } from './pipeline-process';

export interface IPipelineBuilder {
	setPipelineJson(pipelineJson: any): PipelineBuilder;
	setEnvironment(value: Environment): PipelineBuilder;
	build(): Promise<PipelineProcess>;
}
