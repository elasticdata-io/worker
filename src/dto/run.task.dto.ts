import { ApiProperty } from '@nestjs/swagger';

class PipelineUserInteractionSettings {
	@ApiProperty() watchCommands: Array<object>;
}

class PipelineWindowSettings {
	@ApiProperty() width: number;
	@ApiProperty() height: number;
	@ApiProperty() lang: string;
}

class NetworkSkipResourcesDslDto {
	@ApiProperty() stylesheet: boolean;
	@ApiProperty() image: boolean;
	@ApiProperty() font: boolean;
}

class PipelineNetwork {
	@ApiProperty() skipResources: NetworkSkipResourcesDslDto;
}

class PipelineSettings {
	@ApiProperty() maxWorkingMinutes: number;
	@ApiProperty() window: PipelineWindowSettings;
	@ApiProperty() proxies: string[];
	@ApiProperty() userInteraction: PipelineUserInteractionSettings
	@ApiProperty() network: PipelineNetwork
}

export class RunTaskDto {
	@ApiProperty() json: string;
	@ApiProperty() taskId: string;
	@ApiProperty() pipelineId: string;
	@ApiProperty() pipelineSettings: PipelineSettings;
	@ApiProperty() userUuid: string;
	@ApiProperty() proxies: string[];
}
