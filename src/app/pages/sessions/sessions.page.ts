import { Component, OnInit } from '@angular/core';
import { SessionData } from '../../services/SessionDataService';
import { Router } from '@angular/router';
import { LocalStorage } from '../../utils/Storage';
import { EventsManager } from '../../utils/EventsManager';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
})
export class SessionsPage implements OnInit {
  public sessions: Array<SessionData>;

  constructor(private router: Router) {
  }

  public async viewSession(session: SessionData) {
    this.router.navigate(['session-details']);
    setTimeout(() => EventsManager.publish('Sessions:selectedSession', session), 100);
    // EventsManager.publish('Sessions:selectedSession', session);
  }

  public deleteSession(session: SessionData) {
    this.sessions.splice(this.sessions.indexOf(session), 1);
    LocalStorage.setObject('sessions', this.sessions);
    this.loadSessions();
  }

  public async newSession() {
    this.router.navigate(['session'], {skipLocationChange : true});
  }

  ngOnInit() {
    this.loadSessions();
  }

  public loadSessions() {
    this.sessions = LocalStorage.getObject<Array<SessionData>>('sessions') || new Array<SessionData>();
    this.sessions = this.sessions.reverse();
  }
}
