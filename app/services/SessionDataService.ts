import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {Events} from "ionic-angular";
import {Configuration} from "../Configuration";
import {Converter} from "../utils/Converter";
import {LocalStorage} from "../utils/Storage";
import {EventsManager} from "../utils/EventsManager";
import {TimeData} from "./TimerService";
import * as LeafLet from "leaflet";

export class KCoordinates {
    public accuracy: number;
    public altitude: number;
    public altitudeAccuracy: number;
    public heading: number;
    public latitude: number;
    public longitude: number;
    public speed: number;

    public constructor(coords: Coordinates) {
        this.accuracy = coords.accuracy;
        this.altitude = coords.altitude;
        this.altitudeAccuracy = coords.altitudeAccuracy;
        this.heading = coords.heading;
        this.latitude = coords.latitude;
        this.longitude = coords.longitude;
        this.speed = (coords.speed * Configuration.globals.speed[Configuration.unit]);
    }

    public toLatLng() {
        return new LeafLet.LatLng(this.latitude, this.longitude);
    }

}

export class KPosition {
    coords: KCoordinates;
    timestamp: number;
    pace: Date;
    beatRate: number;
    distance: number;

    public constructor(pos: Position) {
        this.coords = new KCoordinates(pos.coords);
        this.timestamp = pos.timestamp;
        this.coords.speed = Converter.convertSpeedFromMeterPerSeconds(this.coords.speed);
        this.pace = Converter.getPaceFromSpeed(this.coords.speed);
        this.beatRate = null;
        this.distance = 0;
    }
}

export class SessionData {
    public startTime: Date;
    public stopTime: Date;
    public duration: Date;
    public avPace: Date = null; // Average Pace
    public avSpeed: number = 0; // Average Speed;
    public maxSpeed: number = 0; // Max Speed
    public maxAltitude: number = 0; // altitudine Minima
    public minAltitude: number = 99999999; // altitudine Massima
    public elevation: number = 0; // elevazione
    public hillDistance: number = 0; // distanza altitudine (??)
    public flatDistance: number = 0; // Distanza (??)
    // public flatDistanceL : number =0;
    public positions: Array<KPosition> = new Array<KPosition>();
    public lastWeather: any = null;
}

@Injectable()
export class SessionDataService implements Service {
    public static providers = [Events];
    private events: Events;
    private isPaused = false;
    public previousPosition: Position;
    public currentPosition: Position;
    public sessionData: SessionData;
    public isSignalAccurate: boolean;
    private infoKmElaps: number;
    public actualGpsAccuracy: number;

    public constructor(events: Events) {
        this.events = events;
        this.sessionData = new SessionData();
    }

    public start() {
        this.previousPosition = null;
        this.currentPosition = null;
        this.isSignalAccurate = false;
        this.actualGpsAccuracy = null;

        EventsManager.subscribe("GeoLocationService:newPosition", this, this.setCurrentPosition);
        EventsManager.subscribe("WeatherService:newWeather", this, this.setCurrentWeather);
        EventsManager.subscribe("TimerService:stop", this, this.setSessionTime);

        this.infoKmElaps = 1;
     }

    private setSessionTime(params: Array<any>) {
        let timeData = <TimeData>params[0];
        this.sessionData.startTime = timeData.startTime;
        this.sessionData.stopTime = timeData.stopTime;
        this.sessionData.duration = timeData.elapsed;
        this.saveSession();
    }

    private saveSession() {
            if (this.sessionData.positions.length === 0)
            return;
            let sessions = LocalStorage.getObject<Array<SessionData>>("sessions") || new Array<SessionData>();
            sessions.push(this.sessionData);
            LocalStorage.setObject("sessions", sessions);
    }

    private setCurrentPosition(params: Array<any>) {
        let pos = <Position>params[0];
        this.checkSignalAccuracy(pos.coords.accuracy);
        if (this.isSignalAccurate)
            this.currentPosition = pos;
    }

    private checkSignalAccuracy(accuracy: number) {
        this.actualGpsAccuracy = accuracy;
        this.isSignalAccurate  = accuracy <= Configuration.minRecordingAccuracy;
    }

    private setCurrentWeather(params: Array<any>) {
        this.sessionData.lastWeather = params[0];
    }

    public execute() {
        if (this.isPaused === true || this.currentPosition == null ||
            this.previousPosition === this.currentPosition)
            return;

        if (this.previousPosition == null) {
            this.previousPosition = this.currentPosition;
        }

        // do calc
        let kPos = new KPosition(this.currentPosition);

        if (this.sessionData.maxSpeed < kPos.coords.speed)
            this.sessionData.maxSpeed = kPos.coords.speed;

        // Distance
        this.calcDistance(kPos);
        // add Position if needed
        if (kPos.distance !== 0 || this.sessionData.positions.length === 0) {
            this.sessionData.positions.push(kPos);
            EventsManager.publish("SessionDataService:newPosition", kPos);
        }
        this.previousPosition = this.currentPosition;
        this.checkInfoKmElaps();
    }

    private checkInfoKmElaps() {
        if (this.sessionData.flatDistance > this.infoKmElaps) {
            EventsManager.publish("SessionDataService:infoKmElaps", this.sessionData.flatDistance.toFixed(0));
            this.infoKmElaps++;
        }
    }

    private calcDistance(pos: KPosition) {
        const  R = 6378.137; // kms
        let φ1 = Converter.toRadians(this.previousPosition.coords.latitude);
        let φ2 = Converter.toRadians(pos.coords.latitude);
        let Δφ = Converter.toRadians(pos.coords.latitude - this.previousPosition.coords.latitude);
        let Δλ = Converter.toRadians(pos.coords.longitude - this.previousPosition.coords.longitude);

        let Δalt = (pos.coords.altitude != null && this.previousPosition.coords.altitude != null)
                   ? (pos.coords.altitude - this.previousPosition.coords.altitude) / 1000 : 0;
        let a = (Math.pow(Math.sin(Δφ / 2), 2)) + (Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2));
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let dist = R * c;
        let eleDist = Math.sqrt(Math.pow(Δalt, 2) + Math.pow(dist, 2));
        let elapsedTime = pos.timestamp - this.previousPosition.timestamp;
        let dSpeed = (dist) / (elapsedTime / 1000 / 60 / 60);
        if ((dSpeed < 38) && (dSpeed > 2)) {
            pos.distance = dist;
            this.sessionData.hillDistance += eleDist;
            this.sessionData.flatDistance += dist;
            // this.sessionData.flatDistanceL += pos.coords.toLatLng().distanceTo([this.previousPosition.coords.latitude, this.previousPosition.coords.longitude])/1000;
        }

        // Altitude
        if (pos.coords.altitude != null) {
            if (pos.coords.altitude > this.sessionData.maxAltitude)
                this.sessionData.maxAltitude = pos.coords.altitude;
            if (pos.coords.altitude < this.sessionData.minAltitude)
                this.sessionData.minAltitude = pos.coords.altitude;
            this.sessionData.elevation = this.sessionData.maxAltitude - this.sessionData.minAltitude;
        }
    }

    public stop() {
        EventsManager.unsubscribe("GeoLocationService:newPosition", this);
        EventsManager.unsubscribe("WeatherService:newWeather", this);
        EventsManager.unsubscribe("TimerService:stop", this);
    }

    public pause() {
        this.isPaused = true;
    }

    public resume() {
        this.isPaused = false;
    }
}