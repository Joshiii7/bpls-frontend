import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import Point from '@mapbox/point-geometry';
import * as maplibregl from 'maplibre-gl';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  
  map!: maplibregl.Map;
  marker!: maplibregl.Marker;
  savedLocation: { lng: number; lat: number } | null = null;
  defaultPosition = {
    lng: 126.3162286437666,
    lat: 8.217509410444645,
    zoom: 10
  };
  ngAfterViewInit() {
    this.initializeMap();
  }

  getStoredView() {
    const stored = localStorage.getItem('mapView');
    return stored ? JSON.parse(stored) : this.defaultPosition;
  }

  initializeMap() {
    const view = this.getStoredView();

    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [view.lng, view.lat],
      zoom: view.zoom
    });

    this.map.on('load', () => {
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
      .setLngLat([view.lng, view.lat])
      .addTo(this.map);

    this.map.on('move', () => {
      const center = this.map?.getCenter();
      const zoom = this.map?.getZoom();

      if (center) {
        this.marker.setLngLat(center);
      }

      localStorage.setItem(
        'mapView',
        JSON.stringify({ lng: center.lng, lat: center.lat, zoom })
      );
    });
  }

  saveLocation() {
    const pos = this.marker.getLngLat();
    this.savedLocation = { lng: pos.lng, lat: pos.lat };
    Swal.fire({
      icon: 'success',
      title: 'Location Saved!',
      text: `Longitude: ${pos.lng.toFixed(6)}, Latitude: ${pos.lat.toFixed(6)}`,
      confirmButtonText: 'Great!',
      confirmButtonColor: '#009800',
    });
  }
}
