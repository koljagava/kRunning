import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {Events} from "ionic-angular";
import {Configuration} from "../Configuration";
import {DateUtils} from "../utils/Date";
import {StringUtils} from "../utils/String";
import {EventsManager} from "../utils/EventsManager";

export class TimeData {
    public startTime: Date = new Date();
    public stopTime: Date = null;
    public elapsed: Date = DateUtils.getZeroTime();
}

@Injectable()
export class TimerService implements Service {
    public static providers = [Events];
    public timeData: TimeData;
    private events: Events;
    private isPaused = false;
    private infoMinElaps: Date;
    private delay: number;

    public constructor(events: Events) {
        this.events = events;
        this.timeData = new TimeData();
        if (Configuration.startDelaySecs != null) {
            this.delay = Configuration.startDelaySecs * 1000;
        }else {
            this.delay = 0;
        }
        this.resetTimer();
    }

    private resetTimer() {
        this.timeData = new TimeData();
        this.infoMinElaps = DateUtils.getZeroTime();
        this.setInfoMinElaps();
    }

    private checkInfoMinElaps() {
        if (this.timeData.elapsed.getTime() > this.infoMinElaps.getTime()) {
            let mins = Math.ceil((this.timeData.elapsed.getTime() - DateUtils.getZeroTime().getTime()) / 60000) - 1;
            EventsManager.publish("TimerService:infoMinElaps", mins);
            this.setInfoMinElaps();
        }
    }

    private setInfoMinElaps() {
        this.infoMinElaps.setTime(this.infoMinElaps.getTime() + 60000);
    }

    public toString(): string {
        let time: Date;
        if (this.timeData.stopTime != null) {
            time = new Date();
            time.setTime(this.timeData.stopTime.getTime() - this.timeData.startTime.getTime());
        }else {
            time = this.timeData.elapsed;
        }
        return DateUtils.getTimeToSting(time);
    }

    public start(): void {
        this.resetTimer();
        EventsManager.publish("TimerService:start");
    }

    public pause() {
        this.isPaused = true;
    }

    public resume() {
        this.isPaused = false;
    }

    public execute() {
        if (this.isPaused === true)
            return;
        let currTime = new Date();
        this.timeData.elapsed.setTime(currTime.getTime() - this.timeData.startTime.getTime());
        this.timeData.elapsed.setTime(this.timeData.elapsed.getTime() + (this.timeData.elapsed.getTimezoneOffset() * 60000));
        this.checkInfoMinElaps();
    }

    public stop(): void {
        this.timeData.stopTime = new Date(this.timeData.startTime.getTime() + this.timeData.elapsed.getTime());
        EventsManager.publish("TimerService:stop", this.timeData);
    }
}