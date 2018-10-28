import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherViewerComponent } from './weather-viewer.component';

describe('WeatherViewerComponent', () => {
  let component: WeatherViewerComponent;
  let fixture: ComponentFixture<WeatherViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
