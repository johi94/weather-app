import { Service, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WeatherApi } from './weather-api';

const LOCATION = { name: 'Puebla', latitude: 19.05, longitude: -98.21 };

@Service()
export class WeatherStore {
  private readonly weatherApi = inject(WeatherApi);

  readonly city = LOCATION.name;
  readonly weather = toSignal(
    this.weatherApi.getWeather(LOCATION.latitude, LOCATION.longitude)
  );
}
