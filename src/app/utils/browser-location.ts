import { Coordinates } from '../models/city';

const LOCATION_TIMEOUT = 10000;

export function getBrowserCoords(): Promise<Coordinates | undefined> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(undefined);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => resolve(undefined),
      { timeout: LOCATION_TIMEOUT },
    );
  });
}
