import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './core/pipeline/pipeline.module';
import { TaskModule } from './task/task.module';
import { AppConsumer } from './app.consumer';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DocumentationModule } from './documentation/documentation.module';

@Module({
	imports: [
	  	PipelineModule,
		TaskModule,
		DocumentationModule,
		ConfigModule.forRoot({
			load: [configuration],
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		AppConsumer,
	],
})
export class AppModule {
}
