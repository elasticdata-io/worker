import * as chalk from 'chalk';
import * as Amqp from 'amqp-ts';
import { Injectable } from '@nestjs/common';
import { RunTaskDto } from './dto/run.task';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConsumer {

	constructor(private _appService: AppService,
				private _configService: ConfigService) {
		this.init();
	}

	private init() {
		const USE_SIMPLE_WORKER = this._configService.get<string>('USE_SIMPLE_WORKER') === '1';
		if (USE_SIMPLE_WORKER) {
			return;
		}
		const runTaskQueueName = this._configService.get<string>('RUN_TASK_QUEUE_NAME');
		const stopTaskQueueName = this._configService.get<string>('STOP_TASK_QUEUE_NAME');
		const connectionString = this._configService.get<string>('AMQP_CONNECTION_STRING');
		Amqp.log.transports.console.level = this._configService.get<string>('AMQP_LOG_LEVEL');
		const connection = new Amqp.Connection(connectionString);
		connection.on('close', () => {
			console.error('Lost connection to RMQ.  Reconnecting in 60 seconds...');
			return setTimeout(this.init, 20 * 1000);
		});
		const runTaskQueue = connection.declareQueue(runTaskQueueName, { noCreate: true, prefetch: 1 });
		runTaskQueue
		  	.activateConsumer(message => this.runTaskConsume(message), { noAck: false })
	  		.then(() => console.log('runTaskConsume activated'))
			.catch((err) => console.error(err));
		const stopTaskQueue = connection.declareQueue(stopTaskQueueName, { noCreate: true, prefetch: 1 });
		stopTaskQueue
		  .activateConsumer(message => this.stopTaskConsume(message), { noAck: false })
		  .then(() => console.log('stopTaskConsume activated'))
		  .catch((err) => console.error(err));
	}

	protected async runTaskConsume(message: Amqp.Message): Promise<void> {
		try {
			const dto = JSON.parse(message.getContent()) as RunTaskDto;
			AppConsumer.validateDto(dto);
			await this.runPipelineTask(dto);
			message.ack();
		} catch (e) {
			console.error(chalk.red(e));
			console.log(e);
			message.reject();
		}
	}

	protected async stopTaskConsume(message: Amqp.Message): Promise<void> {
		try {
			const taskId = message.getContent() as string;
			await this.stopPipelineTask(taskId);
			message.ack();
		} catch (e) {
			console.error(chalk.red(e));
			message.reject();
		}
	}

	private async runPipelineTask(dto: RunTaskDto): Promise<void> {
		await this._appService.runPipelineTask(dto);
	}

	private async stopPipelineTask(taskId: string): Promise<void> {
		await this._appService.stopPipelineTask(taskId);
	}

	private static validateDto(dto: RunTaskDto) {
		if (dto.json && dto.taskId && dto.userUuid) {
			return
		}
		throw `runTaskDto in not valid ${JSON.stringify(dto)}`;
	}
}
