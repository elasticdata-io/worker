import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './file.entity';

@Injectable()
export class FilePersistenceService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  findAll(): Promise<FileEntity[]> {
    return this.filesRepository.find();
  }

  findOne(id: string): Promise<FileEntity | null> {
    return this.filesRepository.findOneBy({ id });
  }

  findOneByName(name: string): Promise<FileEntity | null> {
    return this.filesRepository.findOneBy({ name });
  }

  async create(config: {
    bucketUuid: string;
    name: string;
    content: Buffer;
    headers: Record<string, unknown>;
  }): Promise<FileEntity> {
    return this.filesRepository.save(<FileEntity>{
      bucket: { id: config.bucketUuid },
      content: config.content.toString(),
      headers: config.headers,
      name: config.name,
    });
  }

  async remove(id: number): Promise<void> {
    await this.filesRepository.delete(id);
  }
}
