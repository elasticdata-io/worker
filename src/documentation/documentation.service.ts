import { Injectable } from '@nestjs/common';
import * as Doc from '../pipeline/documentation/specification';
import { CommandSpec } from '../pipeline/documentation/specification';
import { I18nService } from 'nestjs-i18n';
import * as DOC from '../i18n/en/doc.json';

@Injectable()
export class DocumentationService {
  constructor(private readonly i18n: I18nService) {}

  public async getCommands(
    version: string,
    lang: string,
  ): Promise<CommandSpec[]> {
    await this.i18n.refresh();
    const commandsCopy = [];
    const commands = Doc.DOCUMENTATION.commands.filter(
      (x) => (x.version = version),
    );
    for (const command of commands) {
      const CMD = command.cmd.toUpperCase();
      const commandCopy = {
        ...command,
        props: [],
        summary: await this.i18n.t(command.summary, { lang: lang }),
        examples: DOC[CMD]?.EXAMPLES || [],
      };
      for (const prop of command.props) {
        const propCopy = {
          ...prop,
          summary: await this.i18n.t(prop.summary, { lang: lang }),
        };
        commandCopy.props.push(propCopy);
      }
      commandsCopy.push(commandCopy);
    }
    return commandsCopy;
  }
}
