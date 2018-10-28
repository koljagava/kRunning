import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { WeatherViewerComponent } from './components/weather-viewer/weather-viewer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule
  ],
  exports: [
    IonicModule,
    FormsModule,
    HttpClientModule,
    MapViewerComponent,
    WeatherViewerComponent
  ],
  declarations: [
    MapViewerComponent,
    WeatherViewerComponent
  ]
})
export class SharedModule { }
