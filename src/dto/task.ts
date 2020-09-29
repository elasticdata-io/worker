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

	public static isTaskSuspended(task: TaskDto): boolean {
		if (task.status === 'stopping'
			|| task.status === 'stopped'
			|| task.status === 'error'
			|| task.status === 'completed') {
			return true;
		}
		return false;
	}
	public static isTaskStopping(task: TaskDto): boolean {
		return task.status === 'stopping';
	}
}
