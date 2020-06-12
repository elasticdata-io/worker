import { Controller, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { CommandSpec } from '../core/pipeline/documentation/specification';

@Controller('doc')
export class DocumentationController {
	constructor(private readonly documentationService: DocumentationService) {}

	@Get('commands/:version')
	async commands(@Param() params): Promise<CommandSpec[]> {
		try {
			return await this.documentationService.getCommands(params.version);
		} catch (e) {
			throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
