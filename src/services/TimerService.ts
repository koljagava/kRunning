import {Service} from './Service';
import {Configuration} from '../Configuration';
import {DateUtils} from '../utils/Date';
import {EventsManager} from '../utils/EventsManager';

export class TimerData {
    public startTime: Date = new Date();
    public stopTime: Date = null;
    public elapsed: Date = DateUtils.getZeroTime();
}

export class TimerService extends Service {
    public timerData: TimerData;
    private infoMinElaps: Date;
    private delay: number;

    public constructor() {
        super(1);
        if (Configuration.startDelaySecs != null) {
            this.delay = Configuration.startDelaySecs * 1000;
        }else {
            this.delay = 0;
        }
        this.resetTimer();
    }

    private resetTimer() {
        this.timerData = new TimerData();
        this.infoMinElaps = DateUtils.getZeroTime();
        this.setInfoMinElaps();
    }

    private checkInfoMinElaps() {
        if (this.timerData.elapsed.getTime() > this.infoMinElaps.getTime()) {
            let mins = Math.ceil((this.timerData.elapsed.getTime() - DateUtils.getZeroTime().getTime()) / 60000) - 1;
            EventsManager.publish('TimerService:infoMinElaps', mins);
            this.setInfoMinElaps();
        }
    }

    private setInfoMinElaps() {
        this.infoMinElaps.setTime(this.infoMinElaps.getTime() + 60000);
    }

    public toString(): string {
        let time: Date;
        if (this.timerData.stopTime != null) {
            time = new Date();
            time.setTime(this.timerData.stopTime.getTime() - this.timerData.startTime.getTime());
        }else {
            time = this.timerData.elapsed;
        }
        return DateUtils.getTimeToSting(time);
    }

    protected doStart(): void {
        this.resetTimer();
        EventsManager.publish('TimerService:start', this.timerData);
    }

    protected execute() {
        let currTime = new Date();
        this.timerData.elapsed.setTime(currTime.getTime() - this.timerData.startTime.getTime());
        this.timerData.elapsed.setTime(this.timerData.elapsed.getTime() + (this.timerData.elapsed.getTimezoneOffset() * 60000));
        this.checkInfoMinElaps();
    }

    protected doStop(): void {
        if (this.timerData.stopTime !== null)
            return;
        this.timerData.stopTime = new Date(this.timerData.startTime.getTime() + this.timerData.elapsed.getTime());
        EventsManager.publish('TimerService:stop', this.timerData);
    }

    protected doDestroy() {
    }
}