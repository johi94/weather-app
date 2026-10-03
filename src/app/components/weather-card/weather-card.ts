import { Component, LOCALE_ID, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { WeatherStore } from '../../services/weather-store';
import { WeatherResponse } from '../../models/weather';
import { describeUv, describeWindDirection } from '../../utils/weather-details';

const PLACEHOLDER = '–';

interface WeatherDetail {
  label: string;
  format: (data: WeatherResponse, locale: string) => string;
}

const DETAILS: WeatherDetail[] = [
  { label: 'Humedad', format: ({ current }) => `${current.relative_humidity_2m} %` },
  { label: 'Viento', format: ({ current }) => `${Math.round(current.wind_speed_10m)} km/h ${describeWindDirection(current.wind_direction_10m)}` },
  { label: 'Índice UV', format: ({ current }) => `${Math.round(current.uv_index)} · ${describeUv(current.uv_index)}` },
  { label: 'Nubosidad', format: ({ current }) => `${current.cloud_cover} %` },
  { label: 'Precipitación', format: ({ current }, locale) => `${current.precipitation.toLocaleString(locale)} mm` },
  { label: 'Presión', format: ({ current }) => `${Math.round(current.pressure_msl)} hPa` },
  { label: 'Amanecer', format: ({ daily }) => daily.sunrise[0].slice(11) },
  { label: 'Atardecer', format: ({ daily }) => daily.sunset[0].slice(11) },
];

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
  protected readonly placeholder = PLACEHOLDER;

  protected readonly details = computed(() => {
    const data = this.weather();
    return DETAILS.map(({ label, format }) => ({
      label,
      value: data ? format(data, this.locale) : PLACEHOLDER,
    }));
  });
}
