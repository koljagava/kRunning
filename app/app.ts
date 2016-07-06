import {Page, App, Platform, IonicApp} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ViewChild} from '@angular/core';
import {HomePage} from './pages/home/home';
import {SessionsPage} from './pages/sessions/sessions';
import {SettingsPage} from './pages/settings/settings';

class MenuPage {
    private static menu :MenuPage[]; 
    public component : any;
    public icon : string;
    public title: string; 
    static getMenu(): MenuPage[] {
        if(this.menu!=null){
            return this.menu;
        }
        this.menu = [
          //{ title: 'Sessions', component: SessionsPage, icon: 'walk' },
          //{ title: 'Session', component: Session, icon: 'boat' },
          //{ title: 'Home', component: HomePage,  icon: 'beer' },
          { title: 'Settings', component: SettingsPage,  icon: 'settings' }
        ];        
        return this.menu;      
    }
}


@App({
  templateUrl: 'build/app.html',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class KRunning {
  private app : IonicApp;
  private platform : Platform;
  private pages :any[];
  private rootPage : any;
  @ViewChild('kMainNav') nav;

  constructor(app : IonicApp, platform : Platform) {
    this.app = app;
    this.platform = platform;
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = MenuPage.getMenu();
    this.rootPage = SessionsPage;
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
    // if(this.nav.root!=page.component){
    //   //this.nav.setRoot(page.component);
    //   this.nav.root = page.component;
    // }
  }
}
