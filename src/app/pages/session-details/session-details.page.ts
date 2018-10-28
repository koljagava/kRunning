import { Component, OnDestroy } from '@angular/core';
import { SessionData } from '../../services/SessionDataService';
import { ActivatedRoute } from '@angular/router';
import { EventsManager } from '../../utils/EventsManager';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.page.html',
  styleUrls: ['./session-details.page.scss'],
})
export class SessionDetailsPage implements OnDestroy {
  public sessionData: SessionData;
  public fnCallBack: Function;

  constructor() {
    this.doCalc(this.sessionData);
    EventsManager.subscribe('Sessions:selectedSession', this, this.setSessionData);
  }

  public doCalc(sessionData: SessionData) {
    return;
    // throw new Error('Not Yet Implemented');
  }

  public ngOnDestroy(): void {
    EventsManager.unsubscribe('Sessions:selectedSession', this);
  }

  setSessionData(sessionData: SessionData): void {
    this.sessionData = sessionData;
  }
}
