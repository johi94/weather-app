const UV_LEVELS: [number, string][] = [
  [2, 'Bajo'],
  [5, 'Moderado'],
  [7, 'Alto'],
  [10, 'Muy alto'],
];

const WIND_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];

export function describeUv(uv: number) {
  const level = Math.round(uv);
  return UV_LEVELS.find(([max]) => level <= max)?.[1] ?? 'Extremo';
}

export function describeWindDirection(degrees: number) {
  const step = 360 / WIND_DIRECTIONS.length;
  return WIND_DIRECTIONS[Math.round(degrees / step) % WIND_DIRECTIONS.length];
}
