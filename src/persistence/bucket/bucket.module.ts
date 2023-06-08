import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketService } from './bucket.service';
import { BucketEntity } from './bucket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BucketEntity])],
  providers: [BucketService],
  exports: [BucketService],
})
export class BucketModule {}
