import { Component, ElementRef, ViewChild } from '@angular/core';
import Point from '@mapbox/point-geometry';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-review-map',
  templateUrl: './review-map.component.html',
  styleUrls: ['./review-map.component.css']
})
export class ReviewMapComponent {
  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  map: maplibregl.Map | undefined;
  marker!: maplibregl.Marker;
  savedLocation: { lng: number; lat: number } | null = null;

  ngOnInit(): void {
    this.map = new maplibregl.Map({
      container: document.getElementById('map')!, 
      // style: 'https://demotiles.maplibre.org/style.json',
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [126.3162286437666, 8.217509410444645],
      zoom: 10
    });
    
    this.map?.on('load', () => {
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
      this.map?.setPaintProperty("road_service_fill", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_minor_fill", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_pri_fill_ramp", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_trunk_fill_ramp", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_mot_fill_ramp", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_sec_fill_noramp", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_pri_fill_noramp", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_trunk_fill_noramp", "fill-color", "#FFFFFF");
      this.map?.setPaintProperty("road_mot_fill_noramp", "fill-color", "#FFFFFF");

    });

    this.marker = new maplibregl.Marker({
      draggable: false,
    })
      .setLngLat(this.map.getCenter())
      .addTo(this.map);

    this.map.on('move', () => {
      const center = this.map?.getCenter();

      if (center) {
        this.marker.setLngLat(center);
      }
    });

  }

  saveLocation(): void {
    const position = this.marker.getLngLat();
    this.savedLocation = { lng: position.lng, lat: position.lat };

    alert(`Location saved: Longitude: ${position.lng}, Latitude: ${position.lat}`);
    console.log('Saved Location:', this.savedLocation);
  }
}
