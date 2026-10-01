export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  admin1?: string;
}

export interface GeocodingResponse {
  results?: City[];
}

export type Coordinates = Pick<City, 'latitude' | 'longitude'>;
