import { Service, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { WeatherApi } from './weather-api';
import { City } from '../models/city';

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
  private readonly selectedCity = signal(DEFAULT_CITY);
  private readonly searchFailed = signal(false);

  private readonly weatherResource = rxResource({
    params: () => this.selectedCity(),
    stream: ({ params }) =>
      this.weatherApi.getWeather(params.latitude, params.longitude),
  });

  readonly city = computed(() => this.selectedCity().name);
  readonly weather = this.weatherResource.value;
  readonly notFound = this.searchFailed.asReadonly();
  readonly temperatureFormat = '1.0-0';

  search(name: string) {
  this.weatherApi.searchCity(name).subscribe((city) => {
    this.searchFailed.set(!city);
    if (city) this.selectedCity.set(city);
  });
}
}

