import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { RunTaskDto } from './dto/run.task';
import { TaskResult } from './core/pipeline/data/dto/task.result';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	async run(@Body() dto: RunTaskDto): Promise<TaskResult> {
		try {
			return await this.appService.runPipelineTask(dto);
		} catch (e) {
			throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
