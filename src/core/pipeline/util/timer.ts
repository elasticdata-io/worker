class TimerFunction {
	id:  NodeJS.Timeout;
	fn: Function;
}

export class Timer {
	private _setTimeoutIds: TimerFunction[];
	private _setIntervalIds: TimerFunction[];
	private _watchInterval: NodeJS.Timeout;

	constructor() {
		this._setTimeoutIds = [];
		this._setIntervalIds = [];
	}

	protected clear() {
		this._setTimeoutIds.forEach(x => {
			clearTimeout(x.id);
			x.fn();
		});
		this._setIntervalIds.forEach(x => {
			clearTimeout(x.id);
			x.fn();
		});
		this._setTimeoutIds = [];
		this._setIntervalIds = [];
	}

	public addSetTimeoutId(id: NodeJS.Timeout, stoppedFn: Function = () => ({})): void {
		this._setTimeoutIds.push({
			id: id,
			fn: stoppedFn,
		});
	}

	public addSetIntervalId(id: NodeJS.Timeout, stoppedFn: Function = () => ({})): void {
		this._setIntervalIds.push({
			id: id,
			fn: stoppedFn,
		});
	}

	public watchStopByFn(stopFn: Function) {
		this._watchInterval = setInterval(() => {
			try {
				if (stopFn()) {
					clearInterval(this._watchInterval);
					this.clear();
				}
			} catch (e) {
				clearInterval(this._watchInterval);
				this.clear();
			}
		}, 250);
	}
}
