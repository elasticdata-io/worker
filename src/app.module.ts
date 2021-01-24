import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PipelineModule } from './core/pipeline/pipeline.module';
import { TaskModule } from './task/task.module';
import { AppConsumer } from './app.consumer';
import { ConfigModule } from '@nestjs/config';
import { DocumentationModule } from './documentation/documentation.module';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { DataStoreModule } from './data-store/data-store.module';
import { AliveModule } from './alive/alive.module';

@Module({
	imports: [
		I18nModule.forRoot({
			fallbackLanguage: 'en',
			parser: I18nJsonParser,
			parserOptions: {
				path: path.join(__dirname, 'i18n'),
				watch: true,
			},
		}),
		PipelineModule,
		TaskModule,
		DocumentationModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		DataStoreModule,
		AliveModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		AppConsumer,
	],
})
export class AppModule {
}
