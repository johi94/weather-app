/** A place from geocoding; field names follow the Open-Meteo API. */
export interface City {
  name: string;
  latitude: number;
  longitude: number;
  /** ISO country code, e.g. `MX`. */
  country_code: string;
  /** First-level region such as a state; not available for every place. */
  admin1?: string;
}

export interface GeocodingResponse {
  /** Missing entirely when the search has no results. */
  results?: City[];
}

export type Coordinates = Pick<City, 'latitude' | 'longitude'>;
