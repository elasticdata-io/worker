import { Body, Controller, Post, HttpException, HttpStatus, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { RunTaskDto } from './dto/run.task.dto';
import { TaskResult } from './core/pipeline/data/dto/task.result';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post()
	async run(@Body() dto: RunTaskDto, @Request() req: any): Promise<TaskResult> {
		try {
			req.on('close', async () => await this.appService.stopPipelineTask());
			return await this.appService.runPipelineTask(dto);
		} catch (e) {
			throw new HttpException(e.stack, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
