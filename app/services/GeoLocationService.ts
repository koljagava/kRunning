import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {Events} from "ionic-angular";
import {Configuration} from "../Configuration";
import {Logging} from "../utils/Logging";
import {StringUtils} from "../utils/String";
import {EventsManager} from "../utils/EventsManager";

@Injectable()
export class GeoLocationService implements Service {
    public static providers = [Events];
    public geoLocOptions: PositionOptions = {
                                    enableHighAccuracy: true,
                                    maximumAge: 0,
                                    timeout: 3000
                                  };
    private geoWatchId: number;
    private events: Events;
    private isPaused = false;
    private geoLocator: Geolocation;

    public constructor(events: Events) {
        this.events = events;
        this.geoWatchId = null;
        if (navigator == null || navigator.geolocation == null) {
            Logging.log(this, new Error("errore implementing geolocation plugin"));
            this.geoLocator = null;
        }else {
            this.geoLocator = navigator.geolocation;
            // this.geoLocator.getCurrentPosition(this.recordPosition.bind(this), this.errorPosition.bind(this), this.geoLocOptions);
        }
        this.start();
    }

    public start() {
        if (this.geoLocator == null)
            return;

        if (this.geoWatchId == null) {
            this.geoWatchId = this.geoLocator.watchPosition(
                    this.recordPosition.bind(this),
                    this.errorPosition.bind(this),
                    this.geoLocOptions);
        }
     }

    private recordPosition(position: Position) {
        if (this.isPaused === true)
            return;
        EventsManager.publish("GeoLocationService:newPosition", position);
    }

    private errorPosition(posErr: PositionError) {
        Logging.log(this, StringUtils.format("Error Position : {0}", posErr.message));
    }

    public execute() {
    }

    public stop() {
        if (this.geoWatchId != null) {
            this.geoLocator.clearWatch(this.geoWatchId);
        }
    }

    public pause() {
        this.isPaused = true;
    }

    public resume() {
        this.isPaused = false;
    }
}
