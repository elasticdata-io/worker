import axios from 'axios';
import {Injectable} from "@nestjs/common";
import { AbstractDynamicLinkService } from './abstract-dynamic-link.service';
import { EnvConfiguration } from '../env/env.configuration';

@Injectable()
export class PersistenceLinkService extends AbstractDynamicLinkService {

	constructor(private readonly appEnv: EnvConfiguration) {
		super();
	}

	public async getHumanLink(absoluteUrl: string): Promise<string> {
		const url = `${this.appEnv.SCRAPER_SERVICE_URL}/api/link/create`
		try {
			const result = await axios.post(url, {absoluteUrl});
			return result.data;
		} catch (e) {
			console.error(e);
		}
		return absoluteUrl;
	}
}
