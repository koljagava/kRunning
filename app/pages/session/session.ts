import {Page, ViewController, Events} from "ionic-angular";
import {ServicesHandler} from "../../services/ServicesHandler";
import {ServicesBuilder} from "../../services/ServicesBuilder";
import {TimerService} from "../../services/TimerService";
import {SessionDataService} from "../../services/SessionDataService";
import {Configuration} from "../../Configuration";
import {MapViewer} from "../../components/map-viewer/map-viewer";
import {WeatherView} from "../../components/weather-viewer/weather-viewer";

@Page({
  templateUrl: "build/pages/session/session.html",
  providers: ServicesBuilder.getProviders([Events, ServicesHandler]),
  directives : [MapViewer, WeatherView]
})

export class Session {
    private events: Events;
    private servicesHandler: ServicesHandler;
    private timer: TimerService;
    private sessionDataService: SessionDataService;
    private viewCtrl: ViewController;
    public isStarted = "secondary";

    public constructor(viewCtrl: ViewController, servicesHandler : ServicesHandler, events : Events) {
        this.viewCtrl = viewCtrl;
        this.events = events;
        this.servicesHandler = servicesHandler;
        this.timer = servicesHandler.getService(TimerService);
        this.sessionDataService = servicesHandler.getService(SessionDataService);
    }

    public stop(): void {
        if (this.servicesHandler.isStarted === true)
            this.servicesHandler.stop();
        this.viewCtrl.dismiss();
    }

    public start(): void {
        this.servicesHandler.start();
    }
}
