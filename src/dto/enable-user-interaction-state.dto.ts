export interface EnableUserInteractionStateDto {
	taskId: string;
	pipelineId: string;
	jpegScreenshotBase64: string;
	pageElements: any[];
	currentUrl: string;
	pageContext: number;
}
