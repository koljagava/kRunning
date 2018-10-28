import { Location } from '@angular/common';
import {ServicesHandler} from '../../services/ServicesHandler';
import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage implements OnDestroy {
  public isStarted = 'secondary';
  public servicesHandler: ServicesHandler;
  public constructor(private router: Router, httpProvider: HttpClient) {
      this.servicesHandler = new ServicesHandler(httpProvider);
  }

  public stop(): void {
      if (this.servicesHandler.isStarted === true) {
          this.servicesHandler.stop();
      }
      this.router.navigate(['sessions'], {skipLocationChange : true});
  }

  public start(): void {
      this.servicesHandler.start();
  }

  public ngOnDestroy(): void {
      this.servicesHandler.destroy();
      delete this.servicesHandler;
  }
}
