import { QueryProvider } from './query-provider';
import { AbstractCommand } from '../command/abstract-command';

export interface Selectable {
  selector: string;
  key: string | AbstractCommand;
  getSelector(): string;
  getQueryProvider(): QueryProvider;
}
