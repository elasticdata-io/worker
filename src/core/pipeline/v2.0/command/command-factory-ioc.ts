import { PipelineIoc } from '../../pipeline-ioc';
import { OpenUrlCommand } from './open-url.command';
import { TYPES } from './types';
import { GetTextCommand } from './get-text.command';
import { GetUrlCommand } from './get-url.command';

export abstract class CommandFactoryIoc {
	static registerCommands(ioc: PipelineIoc): void {
		ioc
		  .bind<OpenUrlCommand>(TYPES.OpenUrlCommand)
		  .to(OpenUrlCommand)
		  .inRequestScope();
		ioc
		  .bind<GetTextCommand>(TYPES.GetTextCommand)
		  .to(GetTextCommand)
		  .inRequestScope();
		ioc
		  .bind<GetUrlCommand>(TYPES.GetUrlCommand)
		  .to(GetUrlCommand)
		  .inRequestScope();
	}
}
