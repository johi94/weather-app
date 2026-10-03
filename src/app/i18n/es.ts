export const es = {
  header: {
    /** Receives the app name, so each language can place it in its own word order. */
    logoAlt: (name: string) => `Logotipo de ${name}`,
    searchPlaceholder: 'Buscar ciudad…',
    searchLabel: 'Buscar ciudad',
    searchButton: 'Buscar',
    languageLabel: 'Idioma',
    invalidCity: 'Ciudad no válida.',
  },
  card: {
    feelsLike: 'Sensación térmica',
    notFound: 'La búsqueda no dio ningún resultado.',
    loading: 'Cargando…',
    humidity: 'Humedad',
    wind: 'Viento',
    windGusts: 'Ráfagas',
    uvIndex: 'Índice UV',
    cloudCover: 'Nubosidad',
    precipitation: 'Precipitación',
    pressure: 'Presión',
    sunrise: 'Amanecer',
    sunset: 'Atardecer',
  },
  forecast: {
    title: 'Pronóstico',
  },
  map: {
    clouds: 'Nubes',
    rain: 'Lluvia',
  },
    weather: {
    clear: 'Despejado',
    mainlyClear: 'Mayormente despejado',
    partlyCloudy: 'Parcialmente nublado',
    overcast: 'Nublado',
    fog: 'Niebla',
    drizzle: 'Llovizna',
    rain: 'Lluvia',
    snow: 'Nieve',
    showers: 'Chubascos',
    snowShowers: 'Chubascos de nieve',
    thunderstorm: 'Tormenta',
    unknown: 'Desconocido',
  },
  uv: {
    low: 'Bajo',
    moderate: 'Moderado',
    high: 'Alto',
    veryHigh: 'Muy alto',
    extreme: 'Extremo',
  },
  windDirections: ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'],
};

/** Shape every language must match; derived from Spanish as the source language. */
export type Translations = typeof es;
