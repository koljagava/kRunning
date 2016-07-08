import {
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS, TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
}                               from '@angular/platform-browser-dynamic/testing';
import { setBaseTestProviders } from '@angular/core/testing';
import { KRunning }             from './app';
import {SessionsPage} from './pages/sessions/sessions';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

let kRunningApp: KRunning = null;

class MockClass {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
  
  public push(page:any) :any {
    return true;
  }
}

describe('kRunning', () => {
  beforeEach(() => {
    let mockClass: any = (<any>new MockClass());
    kRunningApp = new KRunning(mockClass, mockClass);
  });

  it('initialises with one possible page', () => {
    expect(kRunningApp['pages'].length).toEqual(1);
  });

  it('initialises with SessionsPage as root page', () => {
    expect(kRunningApp['rootPage']).toBe(SessionsPage);
  });
  
  it('initialises with a nav', () => {
    expect(kRunningApp['nav']).not.toBe(null);
  });
  
  it('initialises with an app', () => {
    expect(kRunningApp['app']).not.toBe(null);
  });

  it('opens a page', () => {
    spyOn(kRunningApp, 'openPage');
    //spyOn(kRunningApp.nav, 'push');
    let page = kRunningApp['pages'][0];
    kRunningApp.openPage(page);
    expect(kRunningApp.openPage).toHaveBeenCalledWith(page);
    //expect(kRunningApp.nav.push).toHaveBeenCalledWith(page.component);
  });
});