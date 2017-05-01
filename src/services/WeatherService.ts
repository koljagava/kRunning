import {Service} from './Service';
import {StringUtils} from '../utils/String';
import {Http} from '@angular/http';
import {Logging} from '../utils/Logging';
import {EventsManager} from '../utils/EventsManager';

export class WeatherService extends Service {
    private static API_URL = 'http://api.openweathermap.org/data';
    private static API_VER = '2.5';
    private static API_UNIT= 'metric';
    private static API_ID  = 'd47877d6c8ab95bad2106065f5b0390c';
    private static API_LANG= 'it';
    private static API_CMD = '[API_URL]/[API_VER]/weather?APPID=[API_ID]&units=[API_UNIT]&lat=[LATITUDE]&lon=[LONGITUDE]&lang=[API_LANG]';
    private currentPosition: Position;
    /*
    -- Current response
    {"coord":{"lon":139,"lat":35},
    "sys":{"country":"JP","sunrise":1369769524,"sunset":1369821049},
    "weather":[{"id":804,"main":"clouds","description":"overcast clouds","icon":"04n"}],
    "main":{"temp":289.5,"humidity":89,"pressure":1013,"temp_min":287.04,"temp_max":292.04},
    "wind":{"speed":7.31,"deg":187.002},
    "rain":{"3h":0},
    "clouds":{"all":92},
    "dt":1369824698,
    "id":1851632,
    "name":"Shuzenji",
    "cod":200}
    */
    public currWeather: any;

    public get lastUpdate(){
        if (this.currWeather == null || typeof this.currWeather.dt === 'undefined')
            return null;
        return new Date(this.currWeather.dt);
    }

    public constructor(private http: Http) {
        super(600);
        this.currentPosition = null;
        this.currWeather = null;
        EventsManager.subscribe('GeoLocationService:newPosition', this, this.setCurrentPosition);
    }

    public setCurrentPosition(pos: Position) {
        if (this.currentPosition == null) {
            this.currentPosition = pos;
            this.execute();
        }else
            this.currentPosition = pos;
    }

    protected doStart() {
    }

    private getUrl(coord: Coordinates): string {
        let url = WeatherService.API_CMD;
        url = url.replace('[API_URL]', WeatherService.API_URL);
        url = url.replace('[API_VER]', WeatherService.API_VER);
        url = url.replace('[API_ID]', WeatherService.API_ID);
        url = url.replace('[API_UNIT]', WeatherService.API_UNIT);
        url = url.replace('[LATITUDE]', coord.latitude.toString());
        url = url.replace('[LONGITUDE]', coord.longitude.toString());
        url = url.replace('[API_LANG]', WeatherService.API_LANG);
        return url;
    }

    protected execute() {
        try {
            this.http.get(this.getUrl(this.currentPosition.coords))
                .subscribe((response) => {
                    if (response.status === 200) {
                        let weather = response.json();
                        if (typeof weather.cod !== 'undefined') {
                            Logging.log(this, StringUtils.format('Error OpenWeather : {0}', weather.message));
                            return;
                        }
                        this.currWeather = weather;
                        EventsManager.publish('WeatherService:newWeather', this.currWeather);
                    }else {
                        Logging.log(this, StringUtils.format('Error OpenWeather : {0}', response.text()));
                    }
                });
        }catch (err) {
            Logging.log(this, err);
            this.currentPosition = null;
        }
    }

    protected doStop() {
    }

    protected doDestroy() {
        EventsManager.unsubscribe('GeoLocationService:newPosition', this);
    }
}
