import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';

@Module({
  imports: [],
  providers: [
    {
      provide: PipelineBuilderFactory,
      useClass: PipelineBuilderFactory,
    }
  ],
  exports: [PipelineBuilderFactory]
})
export class PipelineModule {}
