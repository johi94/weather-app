import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { WeatherResponse } from '../models/weather';
import { RadarResponse } from '../models/radar';
import { City, Coordinates, GeocodingResponse } from '../models/city';
import { ReverseGeocodeResponse } from '../models/reverse-geocode';
import { Language } from '../i18n/language';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const RADAR_URL = 'https://api.rainviewer.com/public/weather-maps.json';
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const FORECAST_DAYS = 7;

@Service()
export class WeatherApi {
  private readonly http = inject(HttpClient);

  /**
   * Loads current conditions and the daily forecast (today plus `FORECAST_DAYS`) from Open-Meteo.
   * Times are returned in the local time zone of the location.
   */
  getWeather(latitude: number, longitude: number) {
    return this.http.get<WeatherResponse>(FORECAST_URL, {
      params: {
        latitude,
        longitude,
        current:
          'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,' +
          'wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,cloud_cover,precipitation,pressure_msl',
        daily:
          'sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,' +
          'precipitation_probability_max',
        timezone: 'auto',
        forecast_days: FORECAST_DAYS + 1,
      },
    });
  }

  /**
   * Finds the best matching city for a name via the Open-Meteo geocoding API.
   * @param name City name entered by the user.
   * @param language Language for the returned place names.
   * @returns The first match, or `undefined` if nothing was found.
   */
  searchCity(name: string, language: Language) {
    return this.http
      .get<GeocodingResponse>(GEOCODING_URL, {
        params: { name, count: 1, language },
      })
      .pipe(map((response) => response.results?.[0]));
  }


  /**
   * Builds the Leaflet tile URL of the latest RainViewer radar image.
   * The path changes about every 10 minutes, so it has to be requested first.
   * @returns A tile URL template with `{z}`, `{x}` and `{y}` placeholders.
   */
  getRadarTileUrl() {
    return this.http.get<RadarResponse>(RADAR_URL).pipe(
      map(({ host, radar }) => {
        const latest = radar.past[radar.past.length - 1];
        return `${host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
      })
    );
  }

  /**
   * Resolves a place via BigDataCloud. Without coordinates the service falls back to the
   * visitor's IP address. Only use this for the device location (BigDataCloud fair use policy).
   * @param language Language for the returned place names.
   * @param coords Device coordinates from the browser; omit to use IP-based location.
   * @returns The place as a `City`.
   */
  reverseGeocode(language: Language, coords?: Coordinates) {
    return this.http
      .get<ReverseGeocodeResponse>(REVERSE_GEOCODE_URL, {
        params: { ...coords, localityLanguage: language },
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



