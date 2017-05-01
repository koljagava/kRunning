export abstract class Service {
    private id: NodeJS.Timer = null;
    private interval: number = null;
    public get intervalInSecs(){return this.interval === null ? null : this.interval / 1000; }
    private _startTime: Date = null;
    public get startTime(){return this._startTime; }
    private _stopTime: Date = null;
    public get stopTime(){return this._stopTime; }
    private _nextExecTime: Date = null;
    public get nextExecTime(){return this._nextExecTime; }
    private _isPaused = false;
    public get isPaused(){return this._isPaused; }
    private _isStarted = false;
    public get isStarted(){return this._isStarted; }

    public constructor(intervalInSecs: number) {
        this.interval = intervalInSecs * 1000;
    }

    protected abstract execute(): void;
    protected abstract doStart(): void;
    protected abstract doStop(): void;
    protected abstract doDestroy(): void;

    public start() {
        this._isStarted = true;
        this._startTime = new Date();
        if (this.id != null)
            clearInterval(this.id);
        this.doStart();
        if (this.interval != null) {
            let service = this;
            this._nextExecTime = new Date(this._startTime.valueOf());
            this.id = setInterval(() => {
                    service._nextExecTime = new Date(service._startTime.valueOf() + service.interval);
                    if (service._isPaused === true)
                        return;
                    service.execute();
                }
                , service.interval);
        }else {
            this._nextExecTime = null;
            this.id = null;
        }
    }

    public pause(): void {
        this._isPaused = true;
    }

    public resume(): void {
        this._isPaused = false;
    }

    public stop(): void {
        if (this._isStarted === false)
            return;
        this._isStarted = false;
        this.doStop();
        if (this.id !== null) {
            clearInterval(this.id);
            this.id = null;
        }
        this._stopTime = new Date();
    }

    public destroy() {
        this.stop();
        this.doDestroy();
    }
}
