import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { AbstractBrowser } from './browser/abstract-browser';

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
	QueryProviderFactory: Symbol.for("QueryProviderFactory"),
	DataContextResolver: Symbol.for("DataContextResolver"),
	PipelineIoc: Symbol.for("PipelineIoc"),
};

export { TYPES };
