import {Injectable} from '@nestjs/common';
import {ExecuteCmdDto} from "./dto/execute-cmd.dto";
import {DisableUserInteractionStateDto} from "./dto/disable-user-interaction-state.dto";

@Injectable()
export class AppService {

	public async disableInteractionMode(dto: DisableUserInteractionStateDto): Promise<void> {
		// if (this._currentTaskId !== dto.taskId) {
		// 	return;
		// }
		// await this._pipelineProcess.eventBus
		// 	.emit(UserInteractionEvent.DISABLE_USER_INTERACTION_MODE, dto);
	}

	public async executeCommand(dto: ExecuteCmdDto): Promise<void> {
		// if (this._currentTaskId !== dto.taskId) {
		// 	return;
		// }
		// await this._pipelineProcess
		// 	.eventBus.emit(UserInteractionEvent.EXECUTE_CMD, dto);
	}

}
