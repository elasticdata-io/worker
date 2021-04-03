import { Body, Controller, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { RunTaskDto } from '../dto/run.task.dto';
import { TaskResult } from './data/dto/task.result';

@Controller()
export class TaskController {
	constructor(
		private readonly taskService: TaskService,
	) {}

	@Post()
	async run(@Body() dto: RunTaskDto, @Request() req: any): Promise<TaskResult> {
		try {
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
}