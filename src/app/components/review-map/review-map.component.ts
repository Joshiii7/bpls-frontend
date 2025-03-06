import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import Point from '@mapbox/point-geometry';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-review-map',
  templateUrl: './review-map.component.html',
  styleUrls: ['./review-map.component.css']
})
export class ReviewMapComponent {
  @Input('lat') lat: string = '';
  @Input('lng') lng: string = '';

  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  map: maplibregl.Map | undefined;
  marker!: maplibregl.Marker;
  savedLocation: { lng: number; lat: number } | null = null;

  ngOnInit(): void {
    this.initMap();
  }
  
  initMap() {
    const centerLng = this.lng ? parseFloat(this.lng) : 126.3162286437666;
    const centerLat = this.lat ? parseFloat(this.lat) : 8.217509410444645;
  
    this.map = new maplibregl.Map({
      container: document.getElementById('map')!, 
      // style: 'https://demotiles.maplibre.org/style.json',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [centerLng, centerLat],
      zoom: 15
    });
    
    this.map?.on('load', () => {
      // console.log(this.map?.getStyle().layers);
      this.map?.setPaintProperty('background', 'background-color', '#ECECEC');
      this.map?.setPaintProperty('water', 'fill-color', '#8FBEE7');
      this.map?.setPaintProperty("roadname_minor", "text-color", "#000000");
      this.map?.setPaintProperty("roadname_sec", "text-color", "#000000");
      this.map?.setPaintProperty("roadname_pri", "text-color", "#000000");
      this.map?.setPaintProperty("roadname_major", "text-color", "#000000");
      this.map?.setPaintProperty("housenumber", "text-color", "#000000");
      
      this.map?.setPaintProperty("road_service_case", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_service_case", "line-width", 2);
      this.map?.setPaintProperty("road_minor_case", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_minor_case", "line-width", 2);
      this.map?.setPaintProperty("road_pri_case_ramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_pri_case_ramp", "line-width", 3);
      this.map?.setPaintProperty("road_trunk_case_ramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_trunk_case_ramp", "line-width", 3);
      this.map?.setPaintProperty("road_mot_case_ramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_mot_case_ramp", "line-width", 3);
      this.map?.setPaintProperty("road_sec_case_noramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_sec_case_noramp", "line-width", 2);
      this.map?.setPaintProperty("road_pri_case_noramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_pri_case_noramp", "line-width", 3);
      this.map?.setPaintProperty("road_trunk_case_noramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_trunk_case_noramp", "line-width", 3);
      this.map?.setPaintProperty("road_mot_case_noramp", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_mot_case_noramp", "line-width", 3);
      this.map?.setPaintProperty("road_path", "line-color", "#FFFFFF");
      this.map?.setPaintProperty("road_path", "line-width", 1);
      
      // this.map?.setPaintProperty("road_service_fill", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_minor_fill", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_pri_fill_ramp", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_trunk_fill_ramp", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_mot_fill_ramp", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_sec_fill_noramp", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_pri_fill_noramp", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_trunk_fill_noramp", "fill-color", "#FFFFFF");
      // this.map?.setPaintProperty("road_mot_fill_noramp", "fill-color", "#FFFFFF");

    });
  
    this.marker = new maplibregl.Marker({
      draggable: false,
    })
      .setLngLat(this.map.getCenter())
      .addTo(this.map);
  }
}
