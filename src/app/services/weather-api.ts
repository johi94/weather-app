import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { WeatherResponse } from '../models/weather';
import { RadarResponse } from '../models/radar';
import { City, Coordinates, GeocodingResponse } from '../models/city';
import { ReverseGeocodeResponse } from '../models/reverse-geocode';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const RADAR_URL = 'https://api.rainviewer.com/public/weather-maps.json';
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const FORECAST_DAYS = 7;

@Service()
export class WeatherApi {
  private readonly http = inject(HttpClient);

  getWeather(latitude: number, longitude: number) {
    return this.http.get<WeatherResponse>(FORECAST_URL, {
      params: {
        latitude,
        longitude,
        current:
          'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,' +
          'wind_speed_10m,wind_direction_10m,uv_index,cloud_cover,precipitation,pressure_msl',
        daily:
          'sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,' +
          'precipitation_probability_max',
        timezone: 'auto',
        forecast_days: FORECAST_DAYS + 1,
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

  getRadarTileUrl() {
    return this.http.get<RadarResponse>(RADAR_URL).pipe(
      map(({ host, radar }) => {
        const latest = radar.past[radar.past.length - 1];
        return `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
      })
    );
  }

  reverseGeocode(coords?: Coordinates) {
    return this.http
      .get<ReverseGeocodeResponse>(REVERSE_GEOCODE_URL, {
        params: { ...coords, localityLanguage: 'es' },
      })
      .pipe(
        map((response): City => ({
          name: response.city || response.locality,
          latitude: response.latitude,
          longitude: response.longitude,
          country_code: response.countryCode,
          admin1: response.principalSubdivision,
        }))
      );
  }
}



