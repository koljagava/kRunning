import {Component} from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';
import {LocalStorage} from '../../utils/Storage';
import {SessionData} from '../../services/SessionDataService';
import {Session} from '../session/session';
import {SessionDetailsPage} from '../session-details/session-details';

/*
  Generated class for the SessionsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'sessions.html',
})
export class SessionsPage {
  public sessions: Array<SessionData>;

  constructor(public nav: NavController, public modalCtrl: ModalController) {
      this.loadSessions();
  }

  public viewSession(session: SessionData) {
    this.nav.push(SessionDetailsPage, {
            sessionData: session
        });
  }

  public deleteSession(session: SessionData) {
    this.sessions.splice(this.sessions.indexOf(session), 1);
    LocalStorage.setObject('sessions', this.sessions);
    this.loadSessions();
  }

  public newSession() {
    let modSess = this.modalCtrl.create(Session);
    modSess.onDidDismiss(() => {
      this.loadSessions();
    });
    modSess.present(modSess);
  }

  public loadSessions() {
      this.sessions = LocalStorage.getObject<Array<SessionData>>('sessions') || new Array<SessionData>();
      this.sessions = this.sessions.reverse();
  }
}
