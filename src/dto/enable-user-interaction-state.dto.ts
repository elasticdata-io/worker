export interface EnableUserInteractionStateDto {
	taskId: string;
	pipelineId: string;
	userId: string;
	jpegScreenshotLink: string;
	pageElements: any[];
	currentUrl: string;
	pageContext: number;
	timeoutSeconds: number;
}
