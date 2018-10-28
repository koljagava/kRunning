import {Service} from './Service';
import {Configuration} from '../Configuration';
import {Converter} from '../utils/Converter';
import {DateUtils} from '../utils/Date';
import {LocalStorage} from '../utils/Storage';
import {EventsManager} from '../utils/EventsManager';
import {TimerData} from './TimerService';
import * as Leaflet from 'leaflet';

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
    }

    public toLatLng() {
        return Leaflet.latLng(this.latitude, this.longitude);
    }

}

export class KPosition {
    coords: KCoordinates;
    elapsed: Date;
    pace: Date;
    beatRate: number;
    distance: number;
    _speed: number;
    deltaAltitude: number;

    public set speed (speed: number) {
        this._speed = speed;
        this.pace = Converter.getPaceFromSpeed(this.speed);
    }

    public get speed() {
        return this._speed;
    }

    public constructor(pos: Position, elapsed: Date) {
        this.coords = new KCoordinates(pos.coords);
        this.elapsed = new Date(elapsed);
        this.beatRate = null;
        this.distance = 0;
        this._speed = 0;
        this.deltaAltitude = 0;
    }
}

export class SessionData {
    public timerData: TimerData = null;
    public avPace: Date = null; // Average Pace
    public avSpeed = 0; // Average Speed;
    public maxSpeed = 0; // Max Speed
    public maxAltitude = 0; // altitudine Minima
    public minAltitude = 99999999; // altitudine Massima
    public offsetAltitude: number = null; // elevazione
    public hillDistance = 0; // distanza altitudine (??)
    public flatDistance = 0; // Distanza (??)
    // public flatDistanceL : number =0;
    public positions: Array<KPosition> = new Array<KPosition>();
    public lastWeather: any = null;
}

export class SessionDataService extends Service {
    public previousPosition: KPosition;
    public currentPosition: KPosition;
    public sessionData: SessionData;
    public isSignalAccurate: boolean = null;
    private infoKmElaps: number;
    public actualGpsAccuracy: number;
    public actualSpeed: number;
    public actualPace: Date;

    public constructor() {
        super(Configuration.minRecordingGap);
        this.sessionData = new SessionData();
        EventsManager.subscribe('GeoLocationService:newPosition', this, this.setCurrentPosition);
        EventsManager.subscribe('WeatherService:newWeather', this, this.setCurrentWeather);
        EventsManager.subscribe('TimerService:start', this, this.setSessionTimerData);
        EventsManager.subscribe('TimerService:stop', this, this.saveSession);
    }

    protected doStart() {
        this.actualSpeed = 0;
        this.actualPace = new Date(0);
        this.previousPosition = null;
        this.currentPosition = null;
        this.isSignalAccurate = false;
        this.actualGpsAccuracy = null;
        this.infoKmElaps = 1;
     }

    private setSessionTimerData(timerData: TimerData) {
        this.sessionData.timerData = timerData;
    }

    private saveSession() {
            if (this.sessionData.positions.length === 0) {
            return;
            }
            const sessions = LocalStorage.getObject<Array<SessionData>>('sessions') || new Array<SessionData>();
            sessions.push(this.sessionData);
            LocalStorage.setObject('sessions', sessions);
    }

    private setCurrentPosition(pos: Position) {
        this.checkSignalAccuracy(pos.coords.accuracy);
        if (this.isSignalAccurate && this.sessionData.timerData !== null) {
            this.currentPosition = new KPosition(pos, this.sessionData.timerData.elapsed);
        }
        if (this.sessionData.timerData === null) {
            const fakePos = new KPosition(pos, new Date(0));
            EventsManager.publish('SessionDataService:newPosition', [fakePos]);
        }
    }

    private checkSignalAccuracy(accuracy: number) {
        this.actualGpsAccuracy = accuracy;
        this.isSignalAccurate = false;
        if (accuracy <= Configuration.minRecordingAccuracy) {
            this.isSignalAccurate = true;
        } else if (accuracy > 300) {
            this.isSignalAccurate = null;
        }
    }

    private setCurrentWeather(weather: any) {
        this.sessionData.lastWeather = weather;
    }

    protected execute() {
        if (this.previousPosition == null) {
            this.previousPosition = Converter.cloneObject<KPosition>(this.currentPosition);
            // tslint:disable-next-line:max-line-length
            // this.previousPosition.elapsed = DateUtils.getZeroTime(); secondo me è giusto che l'elapsed non si aper forza 0 alla prima misura, se la posizione viene rilevata in ritardo
        }

        if (this.currentPosition == null ||
            this.previousPosition.elapsed.getTime() === this.currentPosition.elapsed.getTime() ||
            this.currentPosition.coords === undefined ||
            this.currentPosition.coords == null ||
            this.currentPosition.coords.latitude === undefined ||
            this.currentPosition.coords.latitude == null) {
            return;
        }

        // do calc
        this.setCalculatedData(this.previousPosition, this.currentPosition);

        // add Position if needed
        if (this.currentPosition.distance !== 0 || this.sessionData.positions.length === 0) {
            this.sessionData.positions.push(this.currentPosition);
            EventsManager.publish('SessionDataService:newPosition', this.sessionData.positions);
        }
        this.previousPosition = this.currentPosition;
        this.checkInfoKmElaps();
    }

    private checkInfoKmElaps() {
        if (this.sessionData.flatDistance > this.infoKmElaps) {
            EventsManager.publish('SessionDataService:infoKmElaps', this.sessionData.flatDistance.toFixed(0));
            this.infoKmElaps++;
        }
    }

    private setCalculatedData(prevPos: KPosition, actPos: KPosition): void {
        const  R = 6378.137; // kms
        const φ1 = Converter.toRadians(prevPos.coords.latitude);
        const φ2 = Converter.toRadians(actPos.coords.latitude);
        const Δφ = Converter.toRadians(actPos.coords.latitude - prevPos.coords.latitude);
        const Δλ = Converter.toRadians(actPos.coords.longitude - prevPos.coords.longitude);

        // TODO : colone object to prevent side effects
        const Δalt = (actPos.coords.altitude != null && prevPos.coords.altitude != null)
                   ? (actPos.coords.altitude - prevPos.coords.altitude) / 1000 : 0;
        const a = (Math.pow(Math.sin(Δφ / 2), 2)) + (Math.cos(φ1) * Math.cos(φ2) * Math.pow(Math.sin(Δλ / 2), 2));
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        const eleDist = Math.sqrt(Math.pow(Δalt, 2) + Math.pow(dist, 2));
        const elapsedTime = actPos.elapsed.getTime() - prevPos.elapsed.getTime();
        let dSpeed = 0;
        if (elapsedTime !== 0) {
            dSpeed = dist / (elapsedTime / 1000 / 60 / 60);
        }
        // if ((dSpeed > 38)) {
        //     pos.distance = 0;
        //     return;
        // }
        actPos.distance = dist;
        this.sessionData.hillDistance += eleDist;
        this.sessionData.flatDistance += dist;
        actPos.speed = dSpeed;
        // tslint:disable-next-line:max-line-length
        // this.sessionData.flatDistanceL += pos.coords.toLatLng().distanceTo([prevPos.coords.latitude, prevPos.coords.longitude])/1000;
        // speed
        this.actualSpeed = actPos.speed;
        // pace
        this.actualPace = actPos.pace;

        // Altitude
        if (actPos.coords.altitude != null) {
            if (actPos.coords.altitude > this.sessionData.maxAltitude) {
                this.sessionData.maxAltitude = actPos.coords.altitude;
            }
            if (actPos.coords.altitude < this.sessionData.minAltitude) {
                this.sessionData.minAltitude = actPos.coords.altitude;
            }
            if (prevPos.coords.altitude != null) {
                actPos.deltaAltitude = actPos.coords.altitude - prevPos.coords.altitude;
            }
        }
        if (this.sessionData.maxSpeed < actPos.speed) {
            this.sessionData.maxSpeed = actPos.speed;
        }

        this.sessionData.avSpeed =  this.sessionData.flatDistance / (actPos.elapsed.getTime() / 1000 / 60 / 60);
        this.sessionData.avPace = Converter.getPaceFromSpeed(this.sessionData.avSpeed);
    }

    protected doStop() {
    }

    protected doDestroy() {
        EventsManager.unsubscribe('GeoLocationService:newPosition', this);
        EventsManager.unsubscribe('WeatherService:newWeather', this);
        EventsManager.unsubscribe('TimerService:stop', this);
    }
}
