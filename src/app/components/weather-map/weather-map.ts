import { Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import * as L from 'leaflet';
import { WeatherStore } from '../../services/weather-store';
import { City } from '../../models/city';

const ZOOM = 10;
const TILE_URL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

@Component({
  selector: 'app-weather-map',
  imports: [],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.scss',
})
export class WeatherMap {
  private readonly store = inject(WeatherStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapElement = viewChild.required<ElementRef<HTMLElement>>('map');
  private map?: L.Map;
  private marker?: L.CircleMarker;

  constructor() {
    afterNextRender(() => this.createMap());
    effect(() => this.moveTo(this.store.currentCity()));
  }

  private createMap() {
    const { latitude, longitude } = this.store.currentCity();
    this.map = L.map(this.mapElement().nativeElement).setView([latitude, longitude], ZOOM);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION }).addTo(this.map);
    this.marker = L.circleMarker([latitude, longitude]).addTo(this.map);
    this.destroyRef.onDestroy(() => this.map?.remove());
  }

  private moveTo({ latitude, longitude }: City) {
    this.map?.flyTo([latitude, longitude], ZOOM);
    this.marker?.setLatLng([latitude, longitude]);
  }
}

