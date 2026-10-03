import { Translations } from '../i18n/es';

const UV_LEVELS: [number, keyof Translations['uv']][] = [
  [2, 'low'],
  [5, 'moderate'],
  [7, 'high'],
  [10, 'veryHigh'],
];

export function describeUv(uv: number, labels: Translations['uv']) {
  const level = Math.round(uv);
  return labels[UV_LEVELS.find(([max]) => level <= max)?.[1] ?? 'extreme'];
}

export function describeWindDirection(degrees: number, directions: string[]) {
  const step = 360 / directions.length;
  return directions[Math.round(degrees / step) % directions.length];
}
