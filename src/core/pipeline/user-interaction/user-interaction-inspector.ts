import {inject, injectable } from "inversify";
import { UserInteractionSettingsConfiguration } from "../configuration/settings-configuration";
import {AbstractCommand} from "../command/abstract-command";
import {TYPES, TYPES as ROOT_TYPES} from "../types";
import {PipelineIoc} from "../pipeline-ioc";
import {ICommandFactory} from "../command/i-command-factory";
import {IBrowserProvider} from "../browser/i-browser-provider";
import {EventBus, PipelineCommandEvent, UserInteractionEvent} from "../event-bus";
import {PageContextResolver} from "../browser/page-context-resolver";
import {Driver} from "../driver/driver";
import {AbstractStore} from "../data/abstract-store";
import {Environment} from "../environment";

export interface UserInteractionState {
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

@injectable()
export class UserInteractionInspector {

	public static DEFAULT_WAIT_MINUTES = 5;

	private _enableInteractionMode: {[key: string]: boolean} = {};
	private _needWatchCommands: AbstractCommand[] = [];
	private readonly _userInteraction: UserInteractionSettingsConfiguration;
	private readonly _pageContextResolver: PageContextResolver;
	private readonly _environment: Environment;
	private readonly _driver: Driver;
	private readonly _dataStore: AbstractStore;
	private readonly _eventBus: EventBus;

	private get needWatchCommands(): AbstractCommand[] {
		const userInteraction = this._userInteraction;
		if (!userInteraction || !userInteraction.watchCommands) {
			return this._needWatchCommands;
		}
		if (!this._needWatchCommands || this._needWatchCommands.length === 0) {
			const watchCommandsJson = JSON.stringify(userInteraction.watchCommands);
			this._needWatchCommands = this.commandFactory.createCommands(watchCommandsJson);
		}
		return this._needWatchCommands;
	}
	private get commandFactory(): ICommandFactory {
		return this._ioc.get<ICommandFactory>(TYPES.ICommandFactory);
	}
	private get browserProvider(): IBrowserProvider {
		return this._ioc.get<IBrowserProvider>(TYPES.IBrowserProvider);
	}

	constructor(@inject(ROOT_TYPES.PipelineIoc) private _ioc: PipelineIoc) {
		this._userInteraction = this._ioc
			.get<UserInteractionSettingsConfiguration>(TYPES.UserInteractionSettingsConfiguration);
		this._driver = this._ioc.get<Driver>(ROOT_TYPES.Driver);
		this._pageContextResolver = this._ioc.get<PageContextResolver>(ROOT_TYPES.PageContextResolver);
		this._dataStore = this._ioc.get<AbstractStore>(ROOT_TYPES.AbstractStore);
		this._environment = this._ioc.get<Environment>(ROOT_TYPES.Environment);
		this._eventBus = this._ioc.get<EventBus>(ROOT_TYPES.EventBus);
		this._initListeners();
	}

	private _initListeners() {
		this._eventBus
			.on(PipelineCommandEvent.BEFORE_EXECUTE_NEXT_COMMAND,
				(command: AbstractCommand) => this.onBeforeExecuteNextCommand(command));
	}

	private async onBeforeExecuteNextCommand(command: AbstractCommand): Promise<void> {
		console.log('onBeforeExecuteNextCommand', new Date())
		const needInteraction = await this.checkNeedInteractionMode(command);
		if (needInteraction) {
			await this.enableUserInteractionMode(command);
		}
	}

	private async _executeWatchCommand(command: AbstractCommand, context: AbstractCommand): Promise<boolean> {
		try {
			await this.browserProvider.execute(command, {inPageContext: context, silent: true});
		} catch (e) {
			return false;
		}
		return true;
	}

	public async checkNeedInteractionMode(executedCommand: AbstractCommand): Promise<boolean> {
		for (const needWatchCommand of this.needWatchCommands) {
			const successful = await this._executeWatchCommand(needWatchCommand, executedCommand);
			if (successful) {
				return true;
			}
		}
		return false;
	}

	public async enableUserInteractionMode(command: AbstractCommand): Promise<void> {
		const pageContext = this._pageContextResolver.resolveContext(command);
		this._enableInteractionMode[pageContext] = true;
		const screenshotBuffer = await this._driver.getScreenshot(command, {quality: 70});
		const jpegScreenshotLink = await this._dataStore.attachJpegFile(screenshotBuffer, command);
		let pageElements = [];
		try {
			pageElements = await this._driver.getPageElements(command);
		} catch (e) {
			console.error(e);
			throw e;
		}
		const currentUrl = await this._driver.getCurrentUrl(command);
		// todo: calculate pageHeightPx & pageWidthPx
		const data: UserInteractionState = {
			jpegScreenshotLink: jpegScreenshotLink,
			pageWidthPx: 1920,
			pageHeightPx: 1080,
			pageElements: pageElements,
			currentUrl: currentUrl,
			pageContext: pageContext,
			userId: this._environment.userUuid,
			pipelineId: this._environment.pipelineId,
			taskId: this._environment.taskId,
			timeoutSeconds: UserInteractionInspector.DEFAULT_WAIT_MINUTES * 60,
		};
		await this._eventBus.emit(UserInteractionEvent.ENABLE_USER_INTERACTION_MODE, data);
		console.log(`ENABLE_USER_INTERACTION_MODE in pageContext: ${pageContext}, currentUrl: ${currentUrl}`);
		const timeout = UserInteractionInspector.DEFAULT_WAIT_MINUTES * 60 * 1000;
		await this._driver.wait(
			timeout,
			1000,
			() => false === Boolean(this._enableInteractionMode[pageContext])
		);
	}
}
