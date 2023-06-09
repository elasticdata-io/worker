import { Module } from '@nestjs/common';
import { PipelineBuilderFactory } from './pipeline-builder-factory';
import { PipelineService } from './pipeline.service';
import { LegacyPipelineController } from './legacy-pipeline.controller';
import { TaskSdkModule } from '../sdk/task/task.sdk.module';
import { EnvModule } from '../env/env.module';
import { PipelineController } from './controller/pipeline.controller';
import { PipelinePersistenceModule } from '../persistence/pipeline/pipeline.module';

@Module({
  imports: [TaskSdkModule, EnvModule, PipelinePersistenceModule],
  providers: [
    {
      provide: PipelineBuilderFactory,
      useClass: PipelineBuilderFactory,
    },
    PipelineService,
  ],
  controllers: [LegacyPipelineController, PipelineController],
  exports: [PipelineService],
})
export class PipelineModule {}
