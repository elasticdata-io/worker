const TYPES = {
	GetTextCommand: Symbol.for("GetTextCommand"),
	OpenUrlCommand: Symbol.for("OpenUrlCommand"),
	ClickCommand: Symbol.for("ClickCommand"),
	CheckDataCommand: Symbol.for("CheckDataCommand"),
	ConditionCommand: Symbol.for("ConditionCommand"),
	GetHtmlCommand: Symbol.for("GetHtmlCommand"),
	GetScreenshotCommand: Symbol.for("GetScreenshotCommand"),
	GetUrlCommand: Symbol.for("GetUrlCommand"),
	HoverCommand: Symbol.for("HoverCommand"),
	ImportCommand: Symbol.for("ImportCommand"),
	JsCommand: Symbol.for("JsCommand"),
	LoopCommand: Symbol.for("LoopCommand"),
	NativeClickCommand: Symbol.for("NativeClickCommand"),
	PauseCommand: Symbol.for("PauseCommand"),
	PutTextCommand: Symbol.for("PutTextCommand"),
	ReplaceTextCommand: Symbol.for("ReplaceTextCommand"),
	ScrollToCommand: Symbol.for("ScrollToCommand"),
	WaitElementCommand: Symbol.for("WaitElementCommand"),
};

export { TYPES };
