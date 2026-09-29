export interface CurrentWeather {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
}
