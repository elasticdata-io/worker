export interface UserInteractionState {
	interactionId: string;
	pageWidthPx: number;
	pageHeightPx: number;
	jpegScreenshotLink: string;
	pageElements: any[];
	currentUrl: string;
	pageContext: number;
	userId: string;
	pipelineId: string;
	taskId: string;
	timeoutSeconds: number;
}
