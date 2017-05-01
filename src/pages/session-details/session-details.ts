import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SessionData} from '../../services/SessionDataService';
// import Chart = require( 'chart.js' );

/*
  Generated class for the SessionDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'session-details.html'
})
export class SessionDetailsPage {
  public sessionData: SessionData;
  public fnCallBack: Function;
  constructor(public nav: NavController, navParams: NavParams) {
      this.sessionData = navParams.get('sessionData');
      this.doCalc(this.sessionData);
  }

  public doCalc(sessionData: SessionData) {
    return;
    // throw new Error('Not Yet Implemented');
  }
}
