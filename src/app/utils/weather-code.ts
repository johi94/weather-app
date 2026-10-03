import { Translations } from '../i18n/es';

type WeatherKey = keyof Translations['weather'];

const WEATHER_CODES: [number, string, WeatherKey][] = [
  [0, '☀️', 'clear'],
  [1, '🌤️', 'mainlyClear'],
  [2, '⛅', 'partlyCloudy'],
  [3, '☁️', 'overcast'],
  [48, '🌫️', 'fog'],
  [57, '🌦️', 'drizzle'],
  [67, '🌧️', 'rain'],
  [77, '🌨️', 'snow'],
  [82, '🌧️', 'showers'],
  [86, '🌨️', 'snowShowers'],
  [99, '⛈️', 'thunderstorm'],
];

export function describeWeather(code: number, labels: Translations['weather']) {
  const [, icon, key] = WEATHER_CODES.find(([max]) => code <= max) ?? [0, '❓', 'unknown'];
  return { icon, label: labels[key] };
}
