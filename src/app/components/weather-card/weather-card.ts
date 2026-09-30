import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { WeatherStore } from '../../services/weather-store';
import { describeUv, describeWindDirection } from '../../utils/weather-details';

@Component({
  selector: 'app-weather-card',
  imports: [DecimalPipe],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  private readonly store = inject(WeatherStore);
  private readonly locale = inject(LOCALE_ID);

  protected readonly city = this.store.city;
  protected readonly weather = this.store.weather;
  protected readonly currentConditions = this.store.currentConditions;
  protected readonly notFound = this.store.notFound;
  protected readonly temperatureFormat = this.store.temperatureFormat;

  protected readonly details = computed(() => {
    const data = this.weather();
    if (!data) return [];
    const { current, daily } = data;
    return [
      { label: 'Humedad', value: `${current.relative_humidity_2m} %` },
      { label: 'Viento', value: `${Math.round(current.wind_speed_10m)} km/h ${describeWindDirection(current.wind_direction_10m)}` },
      { label: 'Índice UV', value: `${Math.round(current.uv_index)} · ${describeUv(current.uv_index)}` },
      { label: 'Nubosidad', value: `${current.cloud_cover} %` },
      { label: 'Precipitación', value: `${current.precipitation.toLocaleString(this.locale)} mm` },
      { label: 'Presión', value: `${Math.round(current.pressure_msl)} hPa` },
      { label: 'Amanecer', value: daily.sunrise[0].slice(11) },
      { label: 'Atardecer', value: daily.sunset[0].slice(11) },
    ];
  });
}
