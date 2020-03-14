import { IPipelineConfigurationBuilder } from './configuration/i-pipeline-configuration-builder';
import { IPipelineLogger } from './log/i-pipeline-logger';
import { AbstractBrowser } from './browser/abstract-browser';

const TYPES = {
	IPipelineBuilder: Symbol.for("IPipelineBuilder"),
	ICommandFactory: Symbol.for("ICommandFactory"),
	IPipelineLogger: Symbol.for("IPipelineLogger"),
	AbstractBrowser: Symbol.for("AbstractBrowser"),
	Environment: Symbol.for("Environment"),
	Driver: Symbol.for("Driver"),
	IPipelineConfigurationBuilder: Symbol.for("IPipelineConfigurationBuilder"),
	PipelineIoc: Symbol.for("PipelineIoc"),
};

export { TYPES };
