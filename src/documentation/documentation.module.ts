import { Module } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { ConfigModule } from '@nestjs/config';
import { DocumentationController } from './documentation.controller';

@Module({
	imports: [
		ConfigModule.forRoot(),
	],
	controllers: [DocumentationController],
	providers: [
		DocumentationService,
	],
	exports: [DocumentationService]
})
export class DocumentationModule {
}
