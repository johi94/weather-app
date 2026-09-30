const WEATHER_CODES: [number, string, string][] = [
  [0, '☀️', 'Despejado'],
  [1, '🌤️', 'Mayormente despejado'],
  [2, '⛅', 'Parcialmente nublado'],
  [3, '☁️', 'Nublado'],
  [48, '🌫️', 'Niebla'],
  [57, '🌦️', 'Llovizna'],
  [67, '🌧️', 'Lluvia'],
  [77, '🌨️', 'Nieve'],
  [82, '🌧️', 'Chubascos'],
  [86, '🌨️', 'Chubascos de nieve'],
  [99, '⛈️', 'Tormenta'],
];

export function describeWeather(code: number) {
  const [, icon, label] = WEATHER_CODES.find(([max]) => code <= max) ?? [0, '❓', 'Desconocido'];
  return { icon, label };
}
