import {Service} from './Service';
import {Logging} from '../utils/Logging';
import {StringUtils} from '../utils/String';
import {EventsManager} from '../utils/EventsManager';

export class GeoLocationService extends Service {
    public geoLocOptions: PositionOptions = {
                                    enableHighAccuracy: true,
                                    maximumAge: 0,
                                    timeout: 3000
                                  };
    private geoWatchId: number;
    private geoLocator: Geolocation;

    public constructor() {
        super(null);
        this.geoWatchId = null;
        if (navigator == null || navigator.geolocation == null) {
            Logging.log(this, new Error('errore implementing geolocation plugin'));
            this.geoLocator = null;
        }else {
            this.geoLocator = navigator.geolocation;
            // this.geoLocator.getCurrentPosition(this.recordPosition.bind(this), this.errorPosition.bind(this), this.geoLocOptions);
        }
        this.doStart();
    }

    protected doStart() {
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
        EventsManager.publish('GeoLocationService:newPosition', position);
    }

    private errorPosition(posErr: PositionError) {
        Logging.log(this, StringUtils.format('Error Position : {0}', posErr.message));
    }

    protected execute() {
    }

    protected doStop() {
        if (this.geoWatchId != null) {
            this.geoLocator.clearWatch(this.geoWatchId);
        }
    }

    protected doDestroy() {
    }
}
