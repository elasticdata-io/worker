import {AbstractCommand} from "../command/abstract-command";
import {inject, injectable} from "inversify";
import {TYPES as ROOT_TYPES} from "../types";
import {PipelineIoc} from "../pipeline-ioc";
import {Driver} from "../driver/driver";

@injectable()
export class CaptchaService {

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {}

	public async checkHasCaptcha(command: AbstractCommand): Promise<boolean> {
		const driver = this._ioc.get<Driver>(ROOT_TYPES.Driver);
		return await driver.checkHasRecaptcha2(command);
	}

	public async resolveCaptcha(command: AbstractCommand): Promise<void> {
		const driver = this._ioc.get<Driver>(ROOT_TYPES.Driver);
		await driver.solveRecaptcha2(command);
	}
}
