import { LoggerService } from '@nestjs/common';
import { injectable } from 'inversify';

@injectable()
export class PipelineLogger implements LoggerService {
	error(message: any, trace?: string, context?: string): any {
		return;
	}

	log(message: any, context?: string): any {
		return;
	}

	warn(message: any, context?: string): any {
		return;
	}
}
