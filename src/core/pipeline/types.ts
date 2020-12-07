import { XpathQueryProvider } from './query/xpath/xpath-query-provider';
import {UserInteractionSettingsConfiguration} from "./configuration/settings-configuration";
import {EventBus} from "./event-bus";

const TYPES = {
	IPipelineBuilder: Symbol.for("IPipelineBuilder"),
	ICommandFactory: Symbol.for("ICommandFactory"),
	PipelineLogger: Symbol.for("PipelineLogger"),
	AbstractBrowser: Symbol.for("AbstractBrowser"),
	Environment: Symbol.for("Environment"),
	Driver: Symbol.for("Driver"),
	IBrowserProvider: Symbol.for("IBrowserProvider"),
	AbstractStore: Symbol.for("AbstractStore"),
	IPipelineConfigurationBuilder: Symbol.for("IPipelineConfigurationBuilder"),
	XpathQueryProvider: Symbol.for("XpathQueryProvider"),
	CssQueryProvider: Symbol.for("CssQueryProvider"),
	QueryProviderFactory: Symbol.for("QueryProviderFactory"),
	DataContextResolver: Symbol.for("DataContextResolver"),
	PageContextResolver: Symbol.for("PageContextResolver"),
	CssLoopSelection: Symbol.for("CssLoopSelection"),
	XpathLoopSelection: Symbol.for("XpathLoopSelection"),
	HttpDataClient: Symbol.for("HttpDataClient"),
	PipelineIoc: Symbol.for("PipelineIoc"),
	DataServiceUrl: Symbol.for("DataServiceUrl"),
	AbstractCommandAnalyzer: Symbol.for("AbstractCommandAnalyzer"),
	BrowserPool: Symbol.for("BrowserPool"),
	UserInteractionInspector: Symbol.for("UserInteractionInspector"),
	UserInteractionSettingsConfiguration: Symbol.for("UserInteractionSettingsConfiguration"),
	EventBus: Symbol.for("EventBus"),
	CaptchaService: Symbol.for("CaptchaService"),
};

export { TYPES };
