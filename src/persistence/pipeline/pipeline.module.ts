import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelinePersistenceService } from './pipeline-persistence.service';
import { PipelineEntity } from './pipeline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PipelineEntity])],
  providers: [PipelinePersistenceService],
  exports: [PipelinePersistenceService],
})
export class PipelinePersistenceModule {}
