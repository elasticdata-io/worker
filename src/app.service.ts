import { Injectable } from '@nestjs/common';
import { PipelineBuilder } from './core/pipeline/pipeline-builder';

@Injectable()
export class AppService {
  private pipelineBuilder: PipelineBuilder;

  constructor(pipelineBuilder: PipelineBuilder) {
    this.pipelineBuilder = pipelineBuilder;
  }

  runPipeline(json: string): void {
    const pipelineProcess = this.pipelineBuilder
      .setPipelineJson(JSON.stringify(json))
      .build();
    pipelineProcess.run();
  }
}
