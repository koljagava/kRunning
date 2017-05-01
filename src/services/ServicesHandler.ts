import {Service} from './Service';
import {Logging} from '../utils/Logging';
import {Http} from '@angular/http';
// Services
import {TimerService} from './TimerService';
import {GeoLocationService} from './GeoLocationService';
import {WeatherService}from './WeatherService';
import {SpeechService}from './SpeechService';
import {SessionDataService}from './SessionDataService';

export class ServicesHandler extends Service {
    public timerService: TimerService;
    public geoLocationService: GeoLocationService;
    public weatherService: WeatherService;
    public speechService: SpeechService;
    public sessionDataService: SessionDataService;

    public constructor(httpProvider: Http) {
        super(null);
        // inject services
        // let injector = ReflectiveInjector.resolveAndCreate([Http, HTTP_PROVIDERS]);
        this.timerService = new TimerService();
        this.geoLocationService = new GeoLocationService();
        this.weatherService = new WeatherService(httpProvider);
        this.speechService = new SpeechService();
        this.sessionDataService = new SessionDataService();
    }

    private enableBackgroundMode() {
        if (cordova == null || cordova.plugins.backgroundMode == null) {
            Logging.log(this, 'Error enabling backgroundMode plugin');
            return;
        }
        cordova.plugins.backgroundMode.setDefaults({
            title: 'kRunning',
            ticker: 'run logger',
            text: 'session started'
        });
        cordova.plugins.backgroundMode.enable();
    }

    private disableBackgroundMode() {
        if (cordova == null || cordova.plugins.backgroundMode == null) {
            Logging.log(this, 'Error disabling backgroundMode plugin');
            return;
        }
        cordova.plugins.backgroundMode.disable();
    }

    protected doStart(): void {
        this.enableBackgroundMode();
        // start Services
        this.timerService.start();
        this.geoLocationService.start();
        this.weatherService.start();
        this.speechService.start();
        this.sessionDataService.start();
    }

    protected doStop(): void {
        // stop Services
        this.timerService.stop();
        this.geoLocationService.stop();
        this.weatherService.stop();
        this.speechService.stop();
        this.sessionDataService.stop();

        this.disableBackgroundMode();
    }

    protected execute() {}

    protected doDestroy() {
        this.timerService.destroy();
        this.geoLocationService.destroy();
        this.weatherService.destroy();
        this.speechService.destroy();
        this.sessionDataService.destroy();
    }
}
