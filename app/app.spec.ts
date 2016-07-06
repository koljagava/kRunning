import {
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS, TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
}                               from '@angular/platform-browser-dynamic/testing';
import { setBaseTestProviders } from '@angular/core/testing';
import { KRunning }             from './app';

setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

let kRunningApp: KRunning = null;

class MockClass {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }

  public close(): any {
    return true;
  }

  public setRoot(): any {
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

  it('initialises with a root page', () => {
    expect(kRunningApp['rootPage']).not.toBe(null);
  });

  it('initialises with an app', () => {
    expect(kRunningApp['app']).not.toBe(null);
  });

  it('opens a page', () => {
    spyOn(kRunningApp['menu'], 'close');
    // cant be bothered to set up DOM testing for app.ts to get access to @ViewChild (Nav)
    kRunningApp['nav'] = (<any>kRunningApp['menu']);
    spyOn(kRunningApp['nav'], 'setRoot');
    kRunningApp.openPage(kRunningApp['pages'][1]);
    expect(kRunningApp['menu']['close']).toHaveBeenCalled();
    expect(kRunningApp['nav'].setRoot).toHaveBeenCalledWith(Page2);
  });
});