export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  uv_index: number;
  cloud_cover: number;
  precipitation: number;
  pressure_msl: number;
}

export interface DailyWeather {
  time: string[];
  sunrise: string[];
  sunset: string[];
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

