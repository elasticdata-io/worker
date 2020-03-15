import { QueryProvider } from './query-provider';

export interface Selectable {
	getSelector(): string;
	getQueryProvider(): QueryProvider;
}
