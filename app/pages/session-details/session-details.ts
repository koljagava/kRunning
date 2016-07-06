import {Page, NavController, NavParams} from 'ionic-angular';
import {SessionData} from '../../services/SessionDataService'
import {MapViewer} from '../../components/mapviewer/MapViewer';

/*
  Generated class for the SessionDetailsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/session-details/session-details.html',
  directives : [MapViewer]
})
export class SessionDetailsPage {
  public sessionData : SessionData;
  public fnCallBack : Function
  constructor(public nav: NavController, navParams: NavParams) {
      this.sessionData = navParams.get("sessionData");
  }

}
