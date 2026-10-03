import { Coordinates } from '../models/city';

const LOCATION_TIMEOUT = 10000;

/**
 * Asks the browser for the device location.
 * Never rejects: resolves `undefined` if geolocation is unsupported, denied or times out,
 * so the caller can fall back to IP-based location.
 * @returns The current coordinates, or `undefined` if they are not available.
 */
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
