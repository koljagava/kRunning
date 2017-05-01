import {Component, OnDestroy} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {ServicesHandler} from '../../services/ServicesHandler';
import {Http} from '@angular/http';

@Component({
  templateUrl: 'session.html'
})

export class Session implements OnDestroy {
    public isStarted = 'secondary';
    public servicesHandler: ServicesHandler;
    public constructor(public viewCtrl: ViewController, private httpProvider: Http) {
        this.servicesHandler = new ServicesHandler(httpProvider);
    }

    public stop(): void {
        if (this.servicesHandler.isStarted === true)
            this.servicesHandler.stop();
        this.viewCtrl.dismiss();
    }

    public start(): void {
        this.servicesHandler.start();
    }

    public ngOnDestroy(): void {
        this.servicesHandler.destroy();
        delete this.servicesHandler;
    }
}
