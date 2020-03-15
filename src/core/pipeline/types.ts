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
	HttpDataClient: Symbol.for("HttpDataClient"),
	PipelineIoc: Symbol.for("PipelineIoc"),
	DataServiceUrl: Symbol.for("DataServiceUrl"),
};

export { TYPES };
