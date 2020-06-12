import { Module } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { DocumentationController } from './documentation.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [configuration],
		}),
	],
	controllers: [DocumentationController],
	providers: [
		DocumentationService,
	],
	exports: [DocumentationService]
})
export class DocumentationModule {
}
