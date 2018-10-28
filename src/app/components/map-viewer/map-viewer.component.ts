import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as LeafLet from 'leaflet';
import { KPosition } from '../../services/SessionDataService';
import { StringUtils } from '../../utils/String';
import { EventsManager } from '../../utils/EventsManager';

@Component({
  selector: 'map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements AfterViewInit, OnDestroy {
  public static id = 0;
  @Input() public height = 300;
  public instanceId: string;
  private map: LeafLet.Map;
  private polyline: LeafLet.Polyline;
  private startMarker: LeafLet.Marker;
  private stopMarker: LeafLet.Marker;
  @Input() public positions: Array<KPosition> = null;

  constructor() {
    this.instanceId = StringUtils.format('kMapViewer_{0}', MapViewerComponent.id++);
    this.instanceId = 'kMapViewer_0';
    this.polyline = null;
  }

  public ngAfterViewInit() {
    const baseMap = LeafLet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, ' +
              'Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            });

    this.map = LeafLet.map(this.instanceId, {
          zoomControl: false,
          layers: [baseMap]
        });

    if (this.positions == null) {
      EventsManager.subscribe('SessionDataService:newPosition', this, this.setPolyline);
    } else {
      setTimeout(() => {
          this.setPolyline(this.positions);
      }, 1500);
    }
  }

  public setPolyline(positions: Array<KPosition>) {
      if (positions == null) {
        return;
      }
      const latLngs = this.getLatLngArray(positions);
      if (this.polyline == null) {
        const iStart = LeafLet.divIcon({iconSize: LeafLet.point(15, 15), html: 's'});
        const iStop = LeafLet.divIcon({iconSize: LeafLet.point(15, 15), html: 'e'});
        // let icon = new L.Icon.Default({
        //     iconUrl: "build/images/marker-icon.png",
        //     shadowUrl :"build/images/marker-shadow.png",
        //     iconSize : [10,20]
        // });
        this.stopMarker =  LeafLet.marker(latLngs[latLngs.length - 1], {icon: iStop, draggable: false} );
        this.startMarker = LeafLet.marker(latLngs[0] , {icon: iStart, draggable: false, title: 'start1', alt: 'start2'});
        this.map.setView(latLngs[0], 16);
        this.polyline = LeafLet.polyline(latLngs);
        this.polyline.addTo(this.map);
        this.stopMarker.addTo(this.map);
        this.startMarker.addTo(this.map);
        this.checkMapBounds();
      } else {
        this.polyline.setLatLngs(latLngs);
        if (latLngs.length > 1) {
          this.stopMarker.setLatLng(latLngs[latLngs.length - 1]);
        }
        this.checkMapBounds();
      }
  }

  private checkMapBounds() {
    const plB = this.polyline.getBounds();
    const mpB = this.map.getBounds();
    if (!mpB.contains(plB)) {
      this.map.fitBounds(plB.pad(0.2), {});
    }
  }

  private getLatLngArray(positions: Array<KPosition>): Array<LeafLet.LatLng> {
    const latLngs = new Array<LeafLet.LatLng>();
    if (positions == null) {
      return latLngs;
    }
    positions.forEach((pos: KPosition) => {
       latLngs.push(LeafLet.latLng(pos.coords.latitude, pos.coords.longitude, pos.coords.altitude));
    });
    return latLngs;
  }

  public ngOnDestroy() {
    MapViewerComponent.id--;
    if (this.positions == null) {
      EventsManager.unsubscribe('SessionDataService:newPosition', this);
    }
  }
}
