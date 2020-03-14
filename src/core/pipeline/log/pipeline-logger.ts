import { Injectable } from '@nestjs/common';
import { IPipelineLogger } from './i-pipeline-logger';

@Injectable()
export class PipelineLogger extends IPipelineLogger {

}
