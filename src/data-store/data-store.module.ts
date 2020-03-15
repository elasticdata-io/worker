import { Module } from '@nestjs/common';
import { DataStoreController } from './data-store.controller';
import { DataStoreService } from './data-store.service';

@Module({
  imports: [],
  controllers: [DataStoreController],
  providers: [
    DataStoreService,
  ],
})
export class DataStoreModule {}
