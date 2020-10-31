import { v4 as uuidv4 } from 'uuid';
import * as chalk from 'chalk';
import * as Amqp from 'amqp-ts';
import { Injectable } from '@nestjs/common';
import { RunTaskDto } from './dto/run.task.dto';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import {ExecuteCmdDto} from "./dto/execute-cmd.dto";
import {InboxMessageType} from "./inbox-message.type";
import {DisableUserInteractionStateDto} from "./dto/disable-user-interaction-state.dto";

interface InboxMessage {
	_type: InboxMessageType;
	data: string;
}

@Injectable()
export class AppConsumer {

	private readonly USE_SIMPLE_WORKER: boolean;

	private readonly INBOX_FANOUT_EXCHANGE_NAME: string;
	private readonly RUN_TASK_EXCHANGE_NAME: string;

	private readonly RUN_TASK_ROUTING_KEY: string;

	private readonly RUN_TASK_QUEUE_NAME: string;
	private readonly INBOX_QUEUE_NAME: string;

	private readonly AMQP_CONNECTION_STRING: string;

	private readonly WORKER_TYPE: string;

	constructor(
		private readonly appService: AppService,
		private readonly config: ConfigService
	) {
		this.USE_SIMPLE_WORKER = this.config.get<string>('USE_SIMPLE_WORKER') === '1';
		this.RUN_TASK_QUEUE_NAME = this.config.get<string>('RUN_TASK_QUEUE_NAME');
		this.INBOX_QUEUE_NAME = this.config.get<string>('INBOX_QUEUE_NAME');
		this.AMQP_CONNECTION_STRING = this.config.get<string>('AMQP_CONNECTION_STRING');
		this.RUN_TASK_ROUTING_KEY = this.config.get<string>('RUN_TASK_ROUTING_KEY');
		this.RUN_TASK_EXCHANGE_NAME = this.config.get<string>('RUN_TASK_EXCHANGE_NAME');
		this.INBOX_FANOUT_EXCHANGE_NAME = this.config.get<string>('INBOX_FANOUT_EXCHANGE_NAME');
		this.WORKER_TYPE = this.config.get<string>('WORKER_TYPE');
		Amqp.log.transports.console.level = this.config.get<string>('AMQP_LOG_LEVEL');
		if (this.USE_SIMPLE_WORKER) {
			return;
		}
		this.init();
	}

	private async init() {
		const connection = new Amqp.Connection(this.AMQP_CONNECTION_STRING);
		connection.on('close', () => {
			console.error('Lost connection to RMQ. Reconnecting in 20 seconds...');
			return setTimeout(this.init, 20 * 1000);
		});
		await this.createTaskRunInbox(connection);
		await this.createFanoutInbox(connection);
	}

	private async createTaskRunInbox(connection: Amqp.Connection) {
		const runTaskExchange = await connection
			.declareExchange(this.RUN_TASK_EXCHANGE_NAME, 'topic', {
				noCreate: false,
				durable: true,
				autoDelete: false,
			});
		const runTaskQueue = connection
			.declareQueue(`${this.RUN_TASK_QUEUE_NAME}_${this.WORKER_TYPE}`, {
				noCreate: false,
				prefetch: 1,
				autoDelete: false,
				exclusive: false,
				durable: true,
			});
		await runTaskQueue.bind(runTaskExchange, `${this.RUN_TASK_ROUTING_KEY}.${this.WORKER_TYPE}`);
		runTaskQueue
			.activateConsumer(
				message => this.runTaskConsume(message),
				{ noAck: false }
			)
			.then(() => console.log('runTaskConsume activated'))
			.catch((err) => console.error(err));
	}

	private async createFanoutInbox(connection: Amqp.Connection) {
		const inboxFanoutExchange = await connection
			.declareExchange(this.INBOX_FANOUT_EXCHANGE_NAME, 'fanout', {
				noCreate: false,
				durable: true,
				autoDelete: false,
			});
		const inboxQueue = connection
			.declareQueue(`${this.INBOX_QUEUE_NAME}_${uuidv4()}`, {
				noCreate: false,
				prefetch: 1,
				autoDelete: true,
				exclusive: true,
			});
		await inboxQueue.bind(inboxFanoutExchange);
		inboxQueue
			.activateConsumer(
				message => this.inboxConsume(message),
				{ noAck: false }
			)
			.then(() => console.log('inboxConsumer activated'))
			.catch((err) => console.error(err));
	}

	private async runTaskConsume(message: Amqp.Message): Promise<void> {
		try {
			const dto = JSON.parse(message.getContent()) as RunTaskDto;
			AppConsumer.validateDto(dto);
			await this.runPipelineTask(dto);
			message.ack();
		} catch (e) {
			console.error(chalk.blue(e));
			console.log(e);
			message.reject();
		}
	}

	private async inboxConsume(message: Amqp.Message): Promise<void> {
		try {
			const inboxMessage = JSON.parse(message.getContent()) as InboxMessage;
			switch (inboxMessage._type) {
				case InboxMessageType.EXECUTE_CMD:
					await this.executeCommand(inboxMessage);
					break;
				case InboxMessageType.STOP_TASK:
					await this.stopPipelineTask(inboxMessage);
					break;
				case InboxMessageType.DISABLE_INTERACTION_MODE:
					await this.disableInteractionMode(inboxMessage);
					break;
			}
			message.ack();
		} catch (e) {
			console.error(chalk.blue(e));
			message.reject();
		}
	}

	private async runPipelineTask(dto: RunTaskDto): Promise<void> {
		await this.appService.runPipelineTask(dto);
	}

	private async executeCommand(inboxMessage: InboxMessage) {
		const dto = JSON.parse(inboxMessage.data) as ExecuteCmdDto;
		await this.appService.executeCommand(dto);
	}

	private async stopPipelineTask(inboxMessage: InboxMessage): Promise<void> {
		await this.appService.stopPipelineTask(inboxMessage.data);
	}

	private async disableInteractionMode(inboxMessage: InboxMessage): Promise<void> {
		const dto = JSON.parse(inboxMessage.data) as DisableUserInteractionStateDto;
		await this.appService.disableInteractionMode(dto);
	}

	private static validateDto(dto: RunTaskDto) {
		if (dto.json && dto.taskId && dto.userUuid && dto.pipelineId) {
			return
		}
		throw `runTaskDto in not valid ${JSON.stringify(dto)}`;
	}
}
