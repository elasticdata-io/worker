import { Body, Controller, Post, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {
	}

	@Post()
	async run(@Body() json: any, @Headers('useruuid') userUuid: string): Promise<string> {
		try {
			return await this.appService.runPipeline(json, userUuid);
		} catch (e) {
			throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
