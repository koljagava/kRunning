import {Service} from './Service';
import {Configuration} from '../Configuration';
import {DateUtils} from '../utils/Date';
import {EventsManager} from '../utils/EventsManager';
import { baseDirectiveCreate } from '@angular/core/src/render3/instructions';
import { TIMEOUT } from 'dns';

export class TimerData {
    public startTime: Date = new Date();
    public stopTime: Date = null;
    public elapsed: Date;
    public constructor() {
        this.elapsed = new Date(this.startTime.getTime() - this.startTime.getTime());
//        this.elapsed.setTime(this.elapsed.getTime() + (this.elapsed.getTimezoneOffset() * 60000));
    }
}

export class TimerService extends Service {
    private static timeOptions: any = { timeZone: 'UTC', timeZoneName: 'short' };
    public timerData: TimerData;
    private infoMinElaps: Date;
    private delay: number;

    public constructor() {
        super(1);
        if (Configuration.startDelaySecs != null) {
            this.delay = Configuration.startDelaySecs * 1000;
        } else {
            this.delay = 0;
        }
        this.resetTimer();
    }

    private resetTimer() {
        this.timerData = new TimerData();
        this.infoMinElaps = new Date(0);
        this.setInfoMinElaps();
    }

    private checkInfoMinElaps() {
        if (this.timerData.elapsed.getTime() > this.infoMinElaps.getTime()) {
            const mins = Math.ceil((this.timerData.elapsed.getTime() - new Date(0).getTime()) / 60000) - 1;
            EventsManager.publish('TimerService:infoMinElaps', mins);
            this.setInfoMinElaps();
        }
    }

    private setInfoMinElaps() {
        this.infoMinElaps.setTime(this.infoMinElaps.getTime() + 60000);
    }

    public toString(): string {
        const time = new Date(0);
        if (this.timerData.stopTime != null) {
            time.setTime((this.timerData.stopTime.getTime() - this.timerData.startTime.getTime()) +
                         (this.timerData.elapsed.getTimezoneOffset() * 60000));
        } else {
            time.setTime(this.timerData.elapsed.getTime() +
                        (this.timerData.elapsed.getTimezoneOffset() * 60000));
        }
        return time.toTimeString().slice(0, 8);
    }

    protected doStart(): void {
        this.resetTimer();
        EventsManager.publish('TimerService:start', this.timerData);
    }

    protected execute() {
        const currTime = new Date();
        this.timerData.elapsed.setTime(currTime.getTime() - this.timerData.startTime.getTime());
//        this.timerData.elapsed.setTime(this.timerData.elapsed.getTime() + (this.timerData.elapsed.getTimezoneOffset() * 60000));
        this.checkInfoMinElaps();
    }

    protected doStop(): void {
        if (this.timerData.stopTime !== null) {
            return;
        }
        this.timerData.stopTime = new Date();
        EventsManager.publish('TimerService:stop', this.timerData);
    }

    protected doDestroy() {
    }
}
