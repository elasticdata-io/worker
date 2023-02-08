import { injectable } from 'inversify';
import { AbstractCommand } from '../command/abstract-command';
import { SystemError } from '../command/exception/system-error';
import { OpenTabAsyncCommand } from '../v2.0/command/async/open-tab.async.command';

@injectable()
export class PageContextResolver {
  protected commands: { [key: string]: number };

  constructor() {
    this.commands = {};
  }

  public resolveContext(command: AbstractCommand): number {
    try {
      return this.commands[command.uuid];
    } catch (e) {
      throw new SystemError(e);
    }
  }

  public setContext(command: AbstractCommand, pageContext: number) {
    try {
      this.commands[command.uuid] = pageContext;
    } catch (e) {
      throw new SystemError(e);
    }
  }

  public setRootContext(command: AbstractCommand) {
    try {
      command.setPageContext(0);
    } catch (e) {
      throw new SystemError(e);
    }
  }

  public increaseContext(originCommand: OpenTabAsyncCommand): void {
    try {
      const maxPageContext = Math.max(...Object.values(this.commands));
      this.commands[originCommand.uuid] = maxPageContext + 1;
    } catch (e) {
      throw new SystemError(e);
    }
  }

  public copyContext(
    origin: AbstractCommand | number,
    targetCommands: AbstractCommand[],
  ): void {
    try {
      const pageContext: number =
        origin instanceof AbstractCommand ? this.commands[origin.uuid] : origin;
      if (pageContext === undefined || pageContext === null) {
        throw new Error(
          `origin command: ${origin.constructor.name} page context not found`,
        );
      }
      targetCommands.forEach((targetCommand) =>
        targetCommand.setPageContext(pageContext),
      );
    } catch (e) {
      throw new SystemError(e);
    }
  }
}
