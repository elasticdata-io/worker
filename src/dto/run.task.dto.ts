interface PipelineUserInteractionSettings {
	watchCommands: any[];
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

export interface RunTaskDto {
	json: string;
	taskId: string;
	pipelineId: string;
	pipelineSettings: PipelineSettings;
	userUuid: string;
	proxies: string[];
}
