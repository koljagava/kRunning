import {Input, AfterViewInit, OnDestroy, Component} from '@angular/core';
import {StringUtils} from '../../utils/String';
import {EventsManager} from '../../utils/EventsManager';
import {KPosition} from '../../services/SessionDataService';
import LeafLet from 'leaflet';

@Component({
  selector: 'map-viewer',
  templateUrl: 'map-viewer.html'
})

export class MapViewer implements AfterViewInit, OnDestroy {
  @Input() public height: number = 300;
  public static id: number = 0;
  public instanceId: string;
  private map: LeafLet.Map;
  private polyline: LeafLet.Polyline;
  private startMarker: LeafLet.Marker;
  private stopMarker: LeafLet.Marker;
  @Input() public positions: Array<KPosition> = null;

  constructor() {
    this.instanceId = StringUtils.format('kMapViewer_{0}', MapViewer.id++);
    this.instanceId = 'kMapViewer_0';
    this.polyline = null;
  }

  public ngAfterViewInit() {
    let baseMap = LeafLet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
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
      if (positions == null)
        return;
      let latLngs = this.getLatLngArray(positions);
      if (this.polyline == null) {
        let iStart = LeafLet.divIcon({iconSize: LeafLet.point(15, 15), html: 's'});
        let iStop = LeafLet.divIcon({iconSize: LeafLet.point(15, 15), html: 'e'});
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
      }else {
        this.polyline.setLatLngs(latLngs);
        if (latLngs.length > 1)
          this.stopMarker.setLatLng(latLngs[latLngs.length - 1]);
        this.checkMapBounds();
      }
  }

  private checkMapBounds() {
    let plB = this.polyline.getBounds();
    let mpB = this.map.getBounds();
    if (!mpB.contains(plB)) {
      this.map.fitBounds(plB.pad(0.2), {});
    }
  }

  private getLatLngArray(positions: Array<KPosition>): Array<LeafLet.LatLng> {
    let latLngs = new Array<LeafLet.LatLng>();
    if (positions == null)
      return latLngs;
    positions.forEach((pos: KPosition) => {
       latLngs.push(LeafLet.latLng(pos.coords.latitude, pos.coords.longitude, pos.coords.altitude));
    });
    return latLngs;
  }

  public ngOnDestroy() {
    MapViewer.id--;
    if (this.positions == null)
      EventsManager.unsubscribe('SessionDataService:newPosition', this);
  }
}