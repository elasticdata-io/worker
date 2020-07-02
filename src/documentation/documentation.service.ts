import { Injectable } from '@nestjs/common';
import * as Doc from '../core/pipeline/documentation/specification';
import { CommandSpec } from '../core/pipeline/documentation/specification';
import { I18nService } from 'nestjs-i18n';
import * as DOC from '../i18n/en/doc.json'

@Injectable()
export class DocumentationService {

	constructor(private readonly i18n: I18nService) {
	}

	public async getCommands(version: string, lang: string): Promise<CommandSpec[]> {
		const commands = Doc.DOCUMENTATION.commands
		  .filter(x => x.version = version);
		for (const command of commands) {
			const CMD = command.cmd.toUpperCase();
			command.summary = await this.i18n.t(command.summary, {lang: lang});
			command.examples = DOC[CMD]?.EXAMPLES || [];
			for (const prop of command.props) {
				prop.summary = await this.i18n.t(prop.summary, {lang: lang});
			}
		}
		return commands;
	}
}
