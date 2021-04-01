import { Body, Controller, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { RunTaskDto } from '../dto/run.task.dto';
import { TaskResult } from './data/dto/task.result';

@Controller()
export class PipelineController {
	constructor(
		private readonly pipelineService: PipelineService,
	) {}

	@Post()
	async run(@Body() dto: RunTaskDto, @Request() req: any): Promise<TaskResult> {
		try {
			// todo: maybe abort task
			req.on('close', async () => await this.pipelineService.stopPipeline());
			return await this.pipelineService.runPipeline(dto);
		} catch (e) {
			throw new HttpException(e.stack, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}