import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { KRunning } from './app.component';
import {Session} from '../pages/session/session';
import {SessionsPage} from '../pages/sessions/sessions';
import {SettingsPage} from '../pages/settings/settings';
import {SessionDetailsPage} from '../pages/session-details/session-details';
import {MapViewer} from '../components/map-viewer/map-viewer';
import {WeatherView} from '../components/weather-viewer/weather-viewer';
import {HttpModule} from '@angular/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    KRunning,
    SessionsPage,
    SettingsPage,
    MapViewer,
    WeatherView,
    Session,
    SessionDetailsPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(KRunning),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    KRunning,
    SessionsPage,
    SettingsPage,
    MapViewer,
    WeatherView,
    Session,
    SessionDetailsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class KRunningModule {}
