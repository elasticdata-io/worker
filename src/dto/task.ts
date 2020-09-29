export type TaskStatus =
	'pending'
	| 'need_other_pipeline'
	| 'wait_other_pipeline'
	| 'need_run'
	| 'queue'
	| 'running'
	| 'completed'
	| 'error'
	| 'stopping'
	| 'stopped';

export class TaskDto {
	id: string;
	status: TaskStatus;

	public isTaskSuspended(): boolean {
		if (this.status === 'stopping'
			|| this.status === 'stopped'
			|| this.status === 'error'
			|| this.status === 'completed') {
			return true;
		}
		return false;
	}
}
