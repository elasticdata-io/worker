import {Controller, HttpException, HttpStatus, Get, Param, Headers} from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { CommandSpec } from '../core/pipeline/documentation/specification';

@Controller('doc')
export class DocumentationController {
	constructor(private readonly docService: DocumentationService) {}

	@Get('commands/:version')
	async commands(@Param() params, @Headers('lang') lang: string): Promise<CommandSpec[]> {
		try {
			return await this.docService.getCommands(params.version, lang);
		} catch (e) {
			throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
