import { Type } from "@angular/core";
import {ReflectiveInjector, Injectable} from "@angular/core";
import {Service, ServiceType, ServiceInfo} from "./Service";
import {Events} from "ionic-angular";
import {ServicesBuilder} from "./ServicesBuilder";
import {Logging} from "../utils/Logging";

@Injectable()
export class ServicesHandler {
    public startTime: Date;
    public stopTime: Date;
    public servicesInfo: Array<ServiceInfo>;
    private services;

    private events: Events;
    private isPaused: boolean;
    public isStarted: boolean;

    public constructor(events: Events) {
        this.events = events;
        this.isPaused = false;
        this.isStarted = false;
        this.servicesInfo = ServicesBuilder.servicesInfo;
        let injector = ReflectiveInjector.resolveAndCreate(ServicesBuilder.getProviders());
        this.servicesInfo.forEach(si => {
            si.service = injector.get(si.serviceType);
        });
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }

    public getService<T extends Service>(serviceType: ServiceType): any {
        return <T>this.servicesInfo.find(si => si.serviceType === serviceType).service;
    }

    private enableBackgroundMode() {
        if (cordova == null || cordova.plugins.backgroundMode == null) {
            Logging.log(this, "Error enabling backgroundMode plugin");
            return;
        }
        cordova.plugins.backgroundMode.setDefaults({
            title: "kkRun",
            ticker: "text1",
            text: "text2"
        });
        cordova.plugins.backgroundMode.enable();
    }

    private disableBackgroundMode() {
        if (cordova == null || cordova.plugins.backgroundMode == null) {
            Logging.log(this, "Error disabling backgroundMode plugin");
            return;
        }
        cordova.plugins.backgroundMode.disable();
    }

    public start(): void {
        this.isStarted = true;
        this.enableBackgroundMode();
        let handler = this;
        this.startTime = new Date();
        this.servicesInfo.forEach(si => {
            if (si.iId != null)
                clearInterval(si.iId);
            si.service.start();
            if (si.interval != null) {
                si.nextExec = new Date(this.startTime.valueOf());
                si.iId = setInterval(() => {
                        if (handler.isPaused === true)
                            return;
                        si.nextExec = new Date(this.startTime.valueOf() + si.interval);
                        si.service.execute();
                    }
                    , si.interval);
            }else {
                si.nextExec = null;
                si.iId = null;
            }
        });
    }

    public stop(): void {
        this.isStarted = false;
        this.servicesInfo.forEach((serviceInfo) => {
                serviceInfo.service.stop();
                if (serviceInfo.iId != null)
                    clearInterval(serviceInfo.iId);
        });
        this.disableBackgroundMode();
    }
}