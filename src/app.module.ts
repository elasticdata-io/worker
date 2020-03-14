import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './core/pipeline/pipeline.module';

@Module({
  imports: [PipelineModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
