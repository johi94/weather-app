import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import * as L from 'leaflet';
import { WeatherStore } from '../../services/weather-store';

const ZOOM = 10;
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

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

  constructor() {
    afterNextRender(() => this.createMap());
  }

  private createMap() {
    const { latitude, longitude } = this.store.currentCity();
    const map = L.map(this.mapElement().nativeElement).setView([latitude, longitude], ZOOM);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION }).addTo(map);
    L.circleMarker([latitude, longitude]).addTo(map);
    this.destroyRef.onDestroy(() => map.remove());
  }
}
