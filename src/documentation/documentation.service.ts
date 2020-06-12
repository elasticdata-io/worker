import { Injectable } from '@nestjs/common';
import * as Doc from '../core/pipeline/documentation/specification';
import { CommandSpec } from '../core/pipeline/documentation/specification';

@Injectable()
export class DocumentationService {

	public async getCommands(version: string): Promise<CommandSpec[]> {
		return Doc.DOCUMENTATION.commands.filter(x => x.version = version);
	}
}
