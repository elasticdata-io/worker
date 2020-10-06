interface PipelineUserInteractionSettings {
	watchSelectors: string[];
}

interface PipelineWindowSettings {
	width: number;
	height: number;
	lang: string;
}

interface PipelineSettings {
	maxWorkingMinutes: number;
	window: PipelineWindowSettings;
	proxies: string[];
	userInteraction: PipelineUserInteractionSettings
}

export class RunTaskDto {
	json: string;
	taskId: string;
	pipelineId: string;
	pipelineSettings: PipelineSettings;
	userUuid: string;
	proxies: string[];
}
