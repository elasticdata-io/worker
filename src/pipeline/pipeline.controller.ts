import { Body, Controller, Get, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { RunTaskDto, PipelineDto, TaskDto } from '../dto';
import { TaskResult } from './data/dto/task.result';

@Controller()
export class PipelineController {
	constructor(
		private readonly taskService: PipelineService,
	) {}

	@Post()
	async run(@Body() dto: RunTaskDto, @Request() req: any): Promise<TaskResult> {
		try {
			RunTaskDto.validate(dto);
			// todo: maybe abort task
			req.on('close', async () => await this.taskService.stop());
			return await this.taskService.run(dto);
		} catch (e) {
			throw new HttpException({
				message: e.toString(),
				stack: e.stack,
			}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('/v1/run-sync')
	async localRun(@Body() pipelineDto: PipelineDto,
								 @Request() req: any): Promise<TaskResult> {
		try {
			PipelineDto.validate(pipelineDto);
			req.on('close', async () => await this.taskService.stop());
			return await this.taskService.run({
				json: pipelineDto,
			} as RunTaskDto);
		} catch (e) {
			throw new HttpException({
				message: e.toString(),
				stack: e.stack,
			}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('/v1/task/status')
	async getTaskStatus(): Promise<TaskDto> {
		try {
			return await this.taskService.getCurrentTask();
		} catch (e) {
			throw new HttpException({
				message: e.toString(),
				stack: e.stack,
			}, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
