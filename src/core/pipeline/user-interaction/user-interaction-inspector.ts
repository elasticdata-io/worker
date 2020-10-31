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
import {ExecuteCmdDto} from "../../../dto/execute-cmd.dto";
import {UserInteractionState} from "./interface";
import {DisableUserInteractionStateDto} from "../../../dto/disable-user-interaction-state.dto";

@injectable()
export class UserInteractionInspector {

	public static DEFAULT_WAIT_MINUTES = 5;

	/**
	 * key - page context, number value - watch command index
	 * @private
	 */
	private _enabledInteractionMode: {[key: string]: number} = {};
	/**
	 * key - page context
	 * @private
	 */
	private _disabledInteractionMode: {[key: string]: true} = {};
	private _needWatchCommands: AbstractCommand[] = [];
	private readonly _userInteraction: UserInteractionSettingsConfiguration;
	private readonly _pageContextResolver: PageContextResolver;
	private readonly _environment: Environment;
	private readonly _driver: Driver;
	private readonly _dataStore: AbstractStore;
	private readonly _eventBus: EventBus;
	private readonly _commandFactory: ICommandFactory;

	private get needWatchCommands(): AbstractCommand[] {
		if (this._needWatchCommands.length) {
			return this._needWatchCommands;
		}
		const userInteraction = this._userInteraction;
		if (!userInteraction || !userInteraction.watchCommands) {
			return this._needWatchCommands;
		}
		const watchCommandsJson = JSON.stringify(userInteraction.watchCommands);
		this._needWatchCommands = this.commandFactory.createCommands(watchCommandsJson);
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
		this._commandFactory = this._ioc.get<ICommandFactory>(ROOT_TYPES.ICommandFactory);
		this._initListeners();
	}

	private _initListeners() {
		this._eventBus
			.on(PipelineCommandEvent.BEFORE_EXECUTE_NEXT_COMMAND,
				(command: AbstractCommand) => this.onBeforeExecuteNextCommand(command));
		this._eventBus
			.on(UserInteractionEvent.EXECUTE_CMD,
				(dto: ExecuteCmdDto) => this.onExecuteCmd(dto));
		this._eventBus
			.on(UserInteractionEvent.DISABLE_USER_INTERACTION_MODE,
				(dto: DisableUserInteractionStateDto) => this.onDisableInteractionMode(dto));
	}

	private async onBeforeExecuteNextCommand(command: AbstractCommand): Promise<void> {
		const watchCommandIndex = await this.checkNeedInteractionMode(command);
		if (watchCommandIndex !== -1) {
			await this.enableUserInteractionMode(command, watchCommandIndex);
		}
	}

	private async onDisableInteractionMode(dto: DisableUserInteractionStateDto) {
		console.log('DISABLE INTERACTION MODE');
		this._disabledInteractionMode[dto.pageContext] = true;
		// todo: change in database
	}

	private async onExecuteCmd(dto: ExecuteCmdDto): Promise<void> {
		const commands = this._commandFactory.createCommands(JSON.stringify(dto.commands));
		try {
			for (const command of commands) {
				const pageContext = parseInt(dto.pageContext, 10);
				console.log(`EXECUTE COMMANDS IN PAGE CONTEXT: ${pageContext}`)
				await this.browserProvider.execute(command, {silent: true, inPageContext: pageContext})
			}
		} catch (e) {
			console.error(e);
		}
		const lastCommand = commands.pop();
		const jpegScreenshotLink = await this._getJpegScreenshotLink(lastCommand);
		let pageElements = [];
		try {
			pageElements = await this._driver.getPageElements(lastCommand);
		} catch (e) {
			console.error(e);
			throw e;
		}
		const currentUrl = await this._driver.getCurrentUrl(lastCommand);
		const data = {
			interactionId: dto.userInteractionId,
			jpegScreenshotLink: jpegScreenshotLink,
			pageWidthPx: 1920,
			pageHeightPx: 1080,
			pageElements: pageElements,
			currentUrl: currentUrl,
		} as UserInteractionState;
		console.log(data)
		await this._eventBus.emit(UserInteractionEvent.UPDATE_USER_INTERACTION_MODE, data);
	}

	private async _getJpegScreenshotLink(command: AbstractCommand): Promise<string> {
		const screenshotBuffer = await this._driver.getScreenshot(command, {quality: 70});
		return await this._dataStore.attachJpegFile(screenshotBuffer, command);
	}

	private async _executeWatchCommand(command: AbstractCommand, context: AbstractCommand): Promise<boolean> {
		try {
			await this.browserProvider.execute(command, {inPageContext: context, silent: true});
		} catch (e) {
			return false;
		}
		return true;
	}

	public async checkNeedInteractionMode(executedCommand: AbstractCommand): Promise<number> {
		for (const [index, watchCommand] of Object.entries(this.needWatchCommands)) {
			const pageContext = this._pageContextResolver.resolveContext(executedCommand);
			const watchCommandIndex = parseInt(index);
			if (this._enabledInteractionMode[pageContext] === watchCommandIndex) {
				continue;
			}
			const successful = await this._executeWatchCommand(watchCommand, executedCommand);
			if (successful) {
				return watchCommandIndex;
			}
		}
		return -1;
	}

	private async enableUserInteractionMode(command: AbstractCommand, watchCommandIndex: number): Promise<void> {
		const pageContext = this._pageContextResolver.resolveContext(command);
		this._enabledInteractionMode[pageContext] = watchCommandIndex;
		delete this._disabledInteractionMode[pageContext];
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
			interactionId: null,
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
		await this._eventBus.emit(UserInteractionEvent.UPDATE_USER_INTERACTION_MODE, data);
		console.log(`ENABLE_USER_INTERACTION_MODE in pageContext: ${pageContext}, currentUrl: ${currentUrl}`);
		const timeout = UserInteractionInspector.DEFAULT_WAIT_MINUTES * 60 * 1000;
		await this._driver.wait(
			timeout,
			1000,
			() => Boolean(this._disabledInteractionMode[pageContext])
		);
	}
}
