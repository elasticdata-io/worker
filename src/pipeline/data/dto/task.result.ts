import { TaskInformation } from '../../analyzer/task.information';

export class TaskResult {
    fileLink: string;
    bytes: number;
    rootLines: number;
    taskInformation: TaskInformation;
}
