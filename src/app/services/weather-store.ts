import { Service, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { WeatherApi } from './weather-api';
import { City } from '../models/city';
import { ForecastDay } from '../models/weather';
import { describeWeather } from '../utils/weather-code';
import { getBrowserCoords } from '../utils/browser-location';
import { LanguageStore } from './language-store';

const DEFAULT_CITY: City = {
  name: 'Puebla',
  latitude: 19.05,
  longitude: -98.21,
  country_code: 'MX',
  admin1: 'Puebla',
};

@Service()
export class WeatherStore {
  private readonly weatherApi = inject(WeatherApi);
  private readonly languageStore = inject(LanguageStore);
  private readonly selectedCity = signal<City | undefined>(undefined);
  private readonly searchFailed = signal(false);

  private readonly weatherResource = rxResource({
    params: () => this.selectedCity(),
    stream: ({ params }) =>
      this.weatherApi.getWeather(params.latitude, params.longitude),
  });

  readonly city = computed(() => this.selectedCity()?.name);
  readonly weather = this.weatherResource.value;
  readonly notFound = this.searchFailed.asReadonly();
  readonly currentCity = this.selectedCity.asReadonly();
  readonly temperatureFormat = '1.0-0';
  
  readonly forecast = computed<ForecastDay[]>(() => {
    const daily = this.weather()?.daily;
    const labels = this.languageStore.t().weather;
    if (!daily) return [];
    return daily.time
      .map((date, i) => ({
        date,
        weatherCode: daily.weather_code[i],
        ...describeWeather(daily.weather_code[i], labels),
      max: daily.temperature_2m_max[i],
      min: daily.temperature_2m_min[i],
      rainChance: daily.precipitation_probability_max[i],
    }))
    .slice(1);
  });

  readonly currentConditions = computed(() => {
    const weather = this.weather();
    return weather
      ? describeWeather(weather.current.weather_code, this.languageStore.t().weather)
      : undefined;
  });

  constructor() {
    this.locateUser();
  }

  private async locateUser() {
    const coords = await getBrowserCoords();
    this.weatherApi.reverseGeocode(this.languageStore.language(), coords).subscribe({
      next: (city) => this.useStartCity(city),
      error: () => this.useStartCity(DEFAULT_CITY),
    });
  }

  private useStartCity(city: City) {
    if (!this.selectedCity()) this.selectedCity.set(city);
  }

  search(name: string) {
  this.weatherApi.searchCity(name, this.languageStore.language()).subscribe((city) => {
    this.searchFailed.set(!city);
    if (city) this.selectedCity.set(city);
  });
}
}