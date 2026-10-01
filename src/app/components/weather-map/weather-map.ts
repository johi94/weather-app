import { Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import * as L from 'leaflet';
import { WeatherStore } from '../../services/weather-store';
import { City } from '../../models/city';
import { WeatherApi } from '../../services/weather-api';

const ZOOM = 10;
const TILE_URL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const RADAR_MAX_ZOOM = 7;
const RADAR_OPACITY = 0.6;
const RADAR_ATTRIBUTION = '<a href="https://www.rainviewer.com/">RainViewer</a>';
const CLOUDS_URL = '/api/clouds.php?z={z}&x={x}&y={y}';
const CLOUDS_OPACITY = 0.8;
const CLOUDS_ATTRIBUTION = '<a href="https://openweathermap.org/">OpenWeatherMap</a>';

@Component({
  selector: 'app-weather-map',
  imports: [],
  templateUrl: './weather-map.html',
  styleUrl: './weather-map.scss',
})
export class WeatherMap {
  private readonly store = inject(WeatherStore);
  private readonly weatherApi = inject(WeatherApi);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapElement = viewChild.required<ElementRef<HTMLElement>>('map');
  private map?: L.Map;
  private marker?: L.CircleMarker;

  constructor() {
    afterNextRender(() => this.createMap());
    effect(() => this.moveTo(this.store.currentCity()));
  }

  private createMap() {
    this.map = L.map(this.mapElement().nativeElement);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION }).addTo(this.map);
    this.addWeatherLayers(this.map);
    this.moveTo(this.store.currentCity());
    this.destroyRef.onDestroy(() => this.map?.remove());
  }

  private addWeatherLayers(map: L.Map) {
    const clouds = L.tileLayer(CLOUDS_URL, {
      opacity: CLOUDS_OPACITY,
      attribution: CLOUDS_ATTRIBUTION,
    });
    const layers = L.control
      .layers(undefined, { Nubes: clouds }, { position: 'bottomleft' })
      .addTo(map);
    this.addRainLayer(layers);
  }

  private addRainLayer(layers: L.Control.Layers) {
    this.weatherApi.getRadarTileUrl().subscribe((url) => {
      const rain = L.tileLayer(url, {
        maxNativeZoom: RADAR_MAX_ZOOM,
        opacity: RADAR_OPACITY,
        attribution: RADAR_ATTRIBUTION,
      });
      layers.addOverlay(rain, 'Lluvia');
    });
  }

  private moveTo(city?: City) {
    if (!city || !this.map) return;
    const position: L.LatLngTuple = [city.latitude, city.longitude];
    if (this.marker) {
      this.map.flyTo(position, ZOOM);
      this.marker.setLatLng(position);
    } else {
      this.map.setView(position, ZOOM);
      this.marker = L.circleMarker(position).addTo(this.map);
    }
  }
}