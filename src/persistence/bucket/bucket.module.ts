import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketPersistenceService } from './bucket-persistence.service';
import { BucketEntity } from './bucket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BucketEntity])],
  providers: [BucketPersistenceService],
  exports: [BucketPersistenceService],
})
export class BucketPersistenceModule {}
