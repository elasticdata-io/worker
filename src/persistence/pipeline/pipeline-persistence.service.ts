import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineEntity } from './pipeline.entity';

@Injectable()
export class PipelinePersistenceService {
  constructor(
    @InjectRepository(PipelineEntity)
    private bucketsRepository: Repository<PipelineEntity>,
  ) {}

  findAll(): Promise<PipelineEntity[]> {
    return this.bucketsRepository.find();
  }

  findOne(id: string): Promise<PipelineEntity | null> {
    return this.bucketsRepository.findOneBy({ id });
  }

  async put(entity: PipelineEntity): Promise<PipelineEntity> {
    const result = await this.bucketsRepository.upsert(entity, ['id']);
    return result?.raw?.pop();
  }

  async remove(id: number): Promise<void> {
    await this.bucketsRepository.delete(id);
  }
}
