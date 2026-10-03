<?php
declare(strict_types=1);

const TILE_URL = 'https://tile.openweathermap.org/map/clouds_new/%d/%d/%d.png?appid=%s';
const SECRETS_FILE = __DIR__ . '/../../secrets.local.json';
const MAX_ZOOM = 18;

function fail(int $status): never
{
    http_response_code($status);
    exit;
}

function readTileParam(string $name, int $max): int
{
    $value = filter_input(INPUT_GET, $name, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 0, 'max_range' => $max],
    ]);
    if (!is_int($value)) {
        fail(400);
    }
    return $value;
}

$z = readTileParam('z', MAX_ZOOM);
$maxTile = (1 << $z) - 1;
$x = readTileParam('x', $maxTile);
$y = readTileParam('y', $maxTile);

$secrets = json_decode((string) @file_get_contents(SECRETS_FILE), true);
$key = $secrets['openWeatherMapKey'] ?? '';
if (!is_string($key) || $key === '') {
    fail(500);
}

$tile = @file_get_contents(sprintf(TILE_URL, $z, $x, $y, $key));
if ($tile === false) {
    fail(502);
}

header('Content-Type: image/png');
header('Cache-Control: public, max-age=600');
echo $tile;
