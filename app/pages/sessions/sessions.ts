import {Page, Modal, NavController} from "ionic-angular";
import {LocalStorage} from "../../utils/Storage";
import {SessionData} from "../../services/SessionDataService";
import {Session} from "../session/session";
import {SessionDetailsPage} from "../session-details/session-details";

/*
  Generated class for the SessionsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: "build/pages/sessions/sessions.html",
})
export class SessionsPage {
  public sessions: Array<SessionData>;
  public nav: NavController;

  constructor(nav: NavController) {
      this.nav = nav;
      this.loadSessions();
  }

  public viewSession(session: SessionData) {
    this.nav.push(SessionDetailsPage, {
            sessionData: session
        });
  }

  public deleteSession(session: SessionData) {
    this.sessions.splice(this.sessions.indexOf(session), 1);
    LocalStorage.setObject("sessions", this.sessions);
    this.loadSessions();
  }

  public newSession() {
    let modSess = Modal.create(Session);
    modSess.onDismiss(() => {
      this.loadSessions();
    });
    this.nav.present(modSess);
  }

  public loadSessions() {
      this.sessions = LocalStorage.getObject<Array<SessionData>>("sessions") || new Array<SessionData>();
      this.sessions = this.sessions.reverse();
  }
}
