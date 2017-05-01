import {Component, Input} from '@angular/core';

/*
  Generated class for the WeatherView component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'weather-viewer',
  templateUrl: 'weather-viewer.html'
})
export class WeatherView {
  @Input() public weather: any;
  constructor() {
  }
  public parsable(): boolean {
    return (this.weather !== null && typeof this.weather !== 'undefined');
  }
  public getWeatherInfo() {
    return this.weather.weather[0];
  }
}
