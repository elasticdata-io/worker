import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EnvConfiguration } from '../env/env.configuration';

@Injectable()
export class AliveService {
	private readonly logger = new Logger(AliveService.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly envConfiguration: EnvConfiguration,
	) {
	}

	@Interval(10 * 1000)
	public async handleCron(): Promise<void> {
		if (this.envConfiguration.USE_ISOLATION_MODE || !this.envConfiguration.USE_ALIVE_PROBE) {
			return;
		}
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
