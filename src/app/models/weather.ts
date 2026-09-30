export interface CurrentWeather {
  temperature_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyWeather;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  icon: string;
  label: string;
  max: number;
  min: number;
  rainChance: number;
}

