import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherResponse } from '../models/weather';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

@Service()
export class WeatherApi {
  private readonly http = inject(HttpClient);

  getCurrentWeather(latitude: number, longitude: number) {
    return this.http.get<WeatherResponse>(FORECAST_URL, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,weather_code,wind_speed_10m',
      },
    });
  }
}
