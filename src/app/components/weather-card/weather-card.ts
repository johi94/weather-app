import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { WeatherStore } from '../../services/weather-store';
import { WeatherResponse } from '../../models/weather';
import { describeUv, describeWindDirection } from '../../utils/weather-details';
import { LanguageStore } from '../../services/language-store';
import { Translations } from '../../i18n/es';

const PLACEHOLDER = '–';

/** One tile in the detail grid: its label and how to format its value. */
interface WeatherDetail {
  labelKey: keyof Translations['card'];
  format: (data: WeatherResponse, locale: string, t: Translations) => string;
}

const DETAILS: WeatherDetail[] = [
  { labelKey: 'humidity', format: ({ current }) => `${current.relative_humidity_2m} %` },
  {
    labelKey: 'wind',
    format: ({ current }, _, t) =>
      `${Math.round(current.wind_speed_10m)} km/h ${describeWindDirection(current.wind_direction_10m, t.windDirections)}`,
  },
  { labelKey: 'windGusts', format: ({ current }) => `${Math.round(current.wind_gusts_10m)} km/h` },
  {
    labelKey: 'uvIndex',
    format: ({ current }, _, t) =>
      `${Math.round(current.uv_index)} · ${describeUv(current.uv_index, t.uv)}`,
  },
  { labelKey: 'cloudCover', format: ({ current }) => `${current.cloud_cover} %` },
  {
    labelKey: 'precipitation',
    format: ({ current }, locale) => `${current.precipitation.toLocaleString(locale)} mm`,
  },
  { labelKey: 'pressure', format: ({ current }) => `${Math.round(current.pressure_msl)} hPa` },
  { labelKey: 'sunrise', format: ({ daily }) => daily.sunrise[0].slice(11) },
  { labelKey: 'sunset', format: ({ daily }) => daily.sunset[0].slice(11) },
];

@Component({
  selector: 'app-weather-card',
  imports: [DecimalPipe],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  private readonly store = inject(WeatherStore);
  private readonly languageStore = inject(LanguageStore);

  protected readonly t = this.languageStore.t;
  protected readonly city = this.store.city;
  protected readonly weather = this.store.weather;
  protected readonly currentConditions = this.store.currentConditions;
  protected readonly notFound = this.store.notFound;
  protected readonly temperatureFormat = this.store.temperatureFormat;
  protected readonly placeholder = PLACEHOLDER;

  protected readonly details = computed(() => {
    const data = this.weather();
    const t = this.t();
    return DETAILS.map(({ labelKey, format }) => ({
      label: t.card[labelKey],
      value: data ? format(data, this.languageStore.language(), t) : PLACEHOLDER,
    }));
  });
}
