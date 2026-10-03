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
  /** `undefined` until the start location is known; the UI shows a loading state meanwhile. */
  private readonly selectedCity = signal<City | undefined>(undefined);
  private readonly searchFailed = signal(false);

  private readonly weatherResource = rxResource({
    params: () => this.selectedCity(),
    stream: ({ params }) => this.weatherApi.getWeather(params.latitude, params.longitude),
  });

  readonly city = computed(() => this.selectedCity()?.name);
  readonly weather = this.weatherResource.value;
  readonly notFound = this.searchFailed.asReadonly();
  readonly currentCity = this.selectedCity.asReadonly();
  /** `DecimalPipe` format for temperatures: whole numbers without decimals. */
  readonly temperatureFormat = '1.0-0';

  /** Forecast for the next days as one object per day; today is skipped. */
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

  /** Icon and translated description of the weather right now. */
  readonly currentConditions = computed(() => {
    const weather = this.weather();
    return weather
      ? describeWeather(weather.current.weather_code, this.languageStore.t().weather)
      : undefined;
  });

  constructor() {
    this.locateUser();
  }

  /**
   * Determines the start city: device location if allowed, otherwise IP-based location,
   * and `DEFAULT_CITY` if both fail.
   */
  private async locateUser() {
    const coords = await getBrowserCoords();
    this.weatherApi.reverseGeocode(this.languageStore.language(), coords).subscribe({
      next: (city) => this.useStartCity(city),
      error: () => this.useStartCity(DEFAULT_CITY),
    });
  }

  /** Sets the start city unless the user has already searched for one. */
  private useStartCity(city: City) {
    if (!this.selectedCity()) this.selectedCity.set(city);
  }

  /**
   * Searches a city and makes it the selected city. If nothing is found,
   * the previous city stays selected and `notFound` becomes `true`.
   * @param name City name entered by the user.
   */
  search(name: string) {
    this.weatherApi.searchCity(name, this.languageStore.language()).subscribe((city) => {
      this.searchFailed.set(!city);
      if (city) this.selectedCity.set(city);
    });
  }
}
