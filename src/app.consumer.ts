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
		const queueName = this._configService.get<string>('WORKER_QUEUE_NAME');
		const connectionString = this._configService.get<string>('AMQP_CONNECTION_STRING');
		Amqp.log.transports.console.level = this._configService.get<string>('AMQP_LOG_LEVEL');
		const connection = new Amqp.Connection(connectionString);
		const queue = connection.declareQueue(queueName, {
			noCreate: true,
			prefetch: 1
		});
		queue.activateConsumer(message => this.consume(message), { noAck: false })
	  		.then(() => {
				console.log('consumer activated');
			})
			.catch((err) => {
			  console.error(err);
			});
	}

	protected async consume(message: Amqp.Message): Promise<void> {
		try {
			const dto = JSON.parse(message.getContent()) as RunTaskDto;
			AppConsumer.validateDto(dto);
			const payload = {
				json: dto.json,
				taskId: dto.taskId,
				userUuid: dto.userUuid,
			};
			await this.runPipelineTask(payload);
			message.ack();
		} catch (e) {
			console.error(e);
			message.reject();
		}
	}

	private async runPipelineTask(dto: RunTaskDto): Promise<string> {
		return this._appService.runPipelineTask(dto);
	}

	private static validateDto(dto: RunTaskDto) {
		if (dto.json && dto.taskId && dto.userUuid) {
			return
		}
		throw `runTaskDto in not valid ${JSON.stringify(dto)}`;
	}
}
