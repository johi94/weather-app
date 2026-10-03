import { Translations } from '../i18n/es';

type WeatherKey = keyof Translations['weather'];

/**
 * WMO weather codes as `[highest code, icon, translation key]`.
 * Codes have gaps, so each entry covers every code up to its upper bound.
 */
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

/**
 * Converts a WMO weather code into an emoji icon and a translated description.
 * @param code WMO weather code from the Open-Meteo API.
 * @param labels Weather descriptions of the current language.
 * @returns Icon and label; unknown codes return `❓` and the "unknown" label.
 */
export function describeWeather(code: number, labels: Translations['weather']) {
  const [, icon, key] = WEATHER_CODES.find(([max]) => code <= max) ?? [0, '❓', 'unknown'];
  return { icon, label: labels[key] };
}
