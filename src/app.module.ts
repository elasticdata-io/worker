import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './core/pipeline/pipeline.module';
import { TaskModule } from './task/task.module';

@Module({
	imports: [
	  	PipelineModule,
		TaskModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
	],
})
export class AppModule {
}
