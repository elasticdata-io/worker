import { Module } from '@nestjs/common';
import configuration from '../config';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from '../../env/env.module';
import { FileStorageController } from './file-storage.controller';
import { FilePersistenceModule } from '../../persistence/file';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    EnvModule,
    FilePersistenceModule,
  ],
  controllers: [FileStorageController],
  providers: [],
})
export class StoresModule {}
