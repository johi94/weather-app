import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { WeatherStore } from '../../services/weather-store';
import { City } from '../../models/city';
import { WeatherApi } from '../../services/weather-api';
import { LanguageStore } from '../../services/language-store';
import { Translations } from '../../i18n/es';

const ZOOM = 10;
const TILE_URL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
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
  private readonly languageStore = inject(LanguageStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mapElement = viewChild.required<ElementRef<HTMLElement>>('map');
  private map?: L.Map;
  private marker?: L.CircleMarker;

  private readonly clouds = L.tileLayer(CLOUDS_URL, {
    opacity: CLOUDS_OPACITY,
    attribution: CLOUDS_ATTRIBUTION,
  });
  private rain?: L.TileLayer;
  private layersControl?: L.Control.Layers;

  constructor() {
    afterNextRender(() => this.createMap());
    effect(() => this.moveTo(this.store.currentCity()));
    effect(() => this.updateLayersControl(this.languageStore.t().map));
  }

  /** Creates the Leaflet map once the template is rendered; position follows via `moveTo`. */
  private createMap() {
    this.map = L.map(this.mapElement().nativeElement);
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION }).addTo(this.map);
    this.updateLayersControl(this.languageStore.t().map);
    this.loadRainLayer();
    this.moveTo(this.store.currentCity());
    this.destroyRef.onDestroy(() => this.map?.remove());
  }

  /** Loads the latest radar image and adds it to the layer control as soon as it is available. */
  private loadRainLayer() {
    this.weatherApi.getRadarTileUrl().subscribe((url) => {
      this.rain = L.tileLayer(url, {
        maxNativeZoom: RADAR_MAX_ZOOM,
        opacity: RADAR_OPACITY,
        attribution: RADAR_ATTRIBUTION,
      });
      this.updateLayersControl(this.languageStore.t().map);
    });
  }

  /**
   * Rebuilds the layer control with translated layer names.
   * Leaflet cannot rename layers, so the control is replaced; active layers stay on the map.
   * @param labels Layer names of the current language.
   */
  private updateLayersControl(labels: Translations['map']) {
    if (!this.map) return;
    this.layersControl?.remove();
    const overlays: L.Control.LayersObject = { [labels.clouds]: this.clouds };
    if (this.rain) overlays[labels.rain] = this.rain;
    this.layersControl = L.control
      .layers(undefined, overlays, { position: 'bottomleft' })
      .addTo(this.map);
  }

  /**
   * Shows the given city on the map. The first city is set directly,
   * later cities are reached with a fly animation.
   */
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
