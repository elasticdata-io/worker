export class CommandInfo {
	name: string;
	uuid: string;
	json: { [key: string]: any };
	startOnUtc: Date;
	endOnUtc: Date;
	status: 'success' | 'error';
	failureReason?: string;
	dataContext: string;
}
