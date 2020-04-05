export class Timer {
	private _setTimeoutIds: NodeJS.Timeout[];
	private _setIntervalIds: NodeJS.Timeout[];
	private _watchInterval: NodeJS.Timeout;

	constructor() {
		this._setTimeoutIds = [];
		this._setIntervalIds = [];
	}

	protected clear() {
		this._setTimeoutIds.forEach(clearTimeout);
		this._setIntervalIds.forEach(clearInterval);
		this._setTimeoutIds = [];
		this._setIntervalIds = [];
	}

	public addSetTimeoutId(id: NodeJS.Timeout): void {
		this._setTimeoutIds.push(id);
	}

	public addSetIntervalId(id: NodeJS.Timeout): void {
		this._setIntervalIds.push(id);
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
