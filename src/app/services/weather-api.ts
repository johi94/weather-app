import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { WeatherResponse } from '../models/weather';
import { GeocodingResponse } from '../models/city';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

@Service()
export class WeatherApi {
  private readonly http = inject(HttpClient);

  getWeather(latitude: number, longitude: number) {
    return this.http.get<WeatherResponse>(FORECAST_URL, {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,weather_code,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        forecast_days: 1,
      },
    });
  }

  searchCity(name: string) {
    return this.http
      .get<GeocodingResponse>(GEOCODING_URL, {
        params: { name, count: 1, language: 'es' },
      })
      .pipe(map((response) => response.results?.[0]));
  }
}



