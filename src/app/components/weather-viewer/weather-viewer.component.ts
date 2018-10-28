import { Component, Input } from '@angular/core';

@Component({
  selector: 'weather-viewer',
  templateUrl: './weather-viewer.component.html',
  styleUrls: ['./weather-viewer.component.scss']
})
export class WeatherViewerComponent {
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
