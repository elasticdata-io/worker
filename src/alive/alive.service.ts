import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { Interval, Timeout } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AliveService {
	private readonly logger = new Logger(AliveService.name);

	constructor(private readonly configService: ConfigService) {
	}

	@Interval(10 * 1000)
	public async handleCron(): Promise<void> {
		const WORKER_TYPE = this.configService.get<string>('WORKER_TYPE');
		const WORKER_MANAGER_URL = this.configService.get<string>('WORKER_MANAGER_URL');
		const WORKER_CONTAINER_ID = this.configService.get<string>('WORKER_CONTAINER_ID');
		const url = `${WORKER_MANAGER_URL}/worker/alive`;
		try {
			await axios.post(url, {
				userId: WORKER_TYPE,
				containerKey: WORKER_CONTAINER_ID,
			});
		} catch (e) {
			this.logger.error(e);
		}
	}
}