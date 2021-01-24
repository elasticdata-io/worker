import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
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
		const FROM_CONTAINER_KEY = this.configService.get<string>('FROM_CONTAINER_KEY');
		const url = `${WORKER_MANAGER_URL}/worker/alive`;
		try {
			await axios.post(url, {
				userId: WORKER_TYPE,
				containerKey: FROM_CONTAINER_KEY,
			});
		} catch (e) {
			this.logger.error(e);
		}
	}
}