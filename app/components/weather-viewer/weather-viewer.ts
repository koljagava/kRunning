import {Component, Input} from "@angular/core";

/*
  Generated class for the WeatherView component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: "weather-viewer",
  templateUrl: "build/components/weather-viewer/weather-viewer.html",
  inputs : ["weather"]
})
export class WeatherView {
  @Input() public weather: any;
  constructor() {
    let a = this.weather;
  }
}
