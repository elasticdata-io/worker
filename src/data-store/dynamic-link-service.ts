import axios from 'axios';
import { ConfigService } from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DynamicLinkService {

	private readonly scraperServiceUrl: string;

	constructor(configService: ConfigService) {
		this.scraperServiceUrl = configService.get<string>('SCRAPER_SERVICE_URL');
	}

	public async getHumanLink(absoluteUrl: string): Promise<string> {
		const url = `${this.scraperServiceUrl}/api/link/create`
		try {
			const result = await axios.post(url, {absoluteUrl});
			return result.data;
		} catch (e) {
			console.error(e);
		}
		return null;
	}
}
