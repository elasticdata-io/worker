import { AbstractCommand } from '../command/abstract-command';
import { injectable } from 'inversify';
import { DataContextResolver } from './data-context-resolver';
import { StringGenerator } from '../util/string.generator';
import { TaskResult } from './dto/task.result';
import { DataRule } from './dto/data-rule';

@injectable()
export abstract class AbstractStore {

	protected id: string;
	protected contextResolver: DataContextResolver;

	protected constructor(dataContextResolver: DataContextResolver) {
		this.contextResolver = dataContextResolver;
		this.id = StringGenerator.generate();
	}

	abstract putAll(data: any[], command: AbstractCommand): Promise<void>;
	abstract replaceMacros(command: AbstractCommand, input: string): Promise<any>;
	abstract put(key: string, value: string, command: AbstractCommand): Promise<void>;
	abstract get(key: string, command: AbstractCommand): Promise<string>;
	abstract remove(key: string, command: AbstractCommand): Promise<void>;
	abstract putFile(key: string, file: Buffer, fileExtension: string, command: AbstractCommand): Promise<string>;
	abstract attachFile(file: Buffer, fileExtension: string, metaData: any, command: AbstractCommand): Promise<string>;
	abstract attachJpegFile(file: Buffer, command: AbstractCommand): Promise<string>;
	abstract attachPngFile(file: Buffer, command: AbstractCommand): Promise<string>;
	abstract attachWebpFile(file: Buffer, command: AbstractCommand): Promise<string>;
	abstract attachJsonFile(json: any, command: AbstractCommand): Promise<string>;
	abstract commit(): Promise<TaskResult>;
	abstract setDataRules(dataRules: Array<DataRule>): Promise<void>;
}
