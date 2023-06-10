import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BucketEntity } from './bucket.entity';

@Injectable()
export class BucketPersistenceService {
  constructor(
    @InjectRepository(BucketEntity)
    private bucketsRepository: Repository<BucketEntity>,
  ) {}

  findAll(): Promise<BucketEntity[]> {
    return this.bucketsRepository.find();
  }

  findOne(id: string): Promise<BucketEntity | null> {
    return this.bucketsRepository.findOneBy({ id });
  }

  async create(id: string): Promise<BucketEntity> {
    return this.bucketsRepository.save(<BucketEntity>{
      id,
    });
  }

  async remove(id: number): Promise<void> {
    await this.bucketsRepository.delete(id);
  }
}
