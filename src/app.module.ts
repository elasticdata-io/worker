import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './core/pipeline/pipeline.module';
import { DataStoreModule } from './data-store/data-store.module';

@Module({
  imports: [PipelineModule, DataStoreModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
