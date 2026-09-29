export interface CurrentWeather {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyWeather {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyWeather;
}
