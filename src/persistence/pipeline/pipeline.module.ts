import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PipelineService } from './pipeline.service';
import { PipelineEntity } from './pipeline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PipelineEntity])],
  providers: [PipelineService],
  exports: [PipelineService],
})
export class PipelinePersistenceModule {}
