import { readFileSync } from 'node:fs';

const { openWeatherMapKey } = JSON.parse(readFileSync('secrets.local.json', 'utf8'));

export default {
  '/api/clouds.php': {
    target: 'https://tile.openweathermap.org',
    changeOrigin: true,
    rewrite: (path) => {
      const params = new URLSearchParams(path.split('?')[1]);
      const [z, x, y] = ['z', 'x', 'y'].map((name) => params.get(name));
      return `/map/clouds_new/${z}/${x}/${y}.png?appid=${openWeatherMapKey}`;
    },
  },
};
