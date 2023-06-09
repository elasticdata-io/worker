import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilePersistenceService } from './file.service';
import { FileEntity } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FilePersistenceService],
  exports: [FilePersistenceService],
})
export class FilePersistenceModule {}
