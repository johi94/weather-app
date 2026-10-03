import { Translations } from '../i18n/es';

const UV_LEVELS: [number, keyof Translations['uv']][] = [
  [2, 'low'],
  [5, 'moderate'],
  [7, 'high'],
  [10, 'veryHigh'],
];

/**
 * Classifies a UV index according to the WHO scale (low, moderate, high, very high, extreme).
 * @param uv UV index from the API; rounded before classification.
 * @param labels UV level names of the current language.
 * @returns The translated UV level.
 */
export function describeUv(uv: number, labels: Translations['uv']) {
  const level = Math.round(uv);
  return labels[UV_LEVELS.find(([max]) => level <= max)?.[1] ?? 'extreme'];
}

/**
 * Converts a wind direction in degrees into the nearest compass direction.
 * @param degrees Direction the wind comes from (0–360°, 0 = north).
 * @param directions Compass directions of the current language, clockwise starting at north.
 * @returns The nearest compass direction, e.g. `SE` for 137°.
 */
export function describeWindDirection(degrees: number, directions: string[]) {
  const step = 360 / directions.length;
  return directions[Math.round(degrees / step) % directions.length];
}
