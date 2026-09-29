import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WeatherApi } from '../../services/weather-api';

const LOCATION = { name: 'Puebla', latitude: 19.05, longitude: -98.21 };

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  private readonly weatherApi = inject(WeatherApi);

  protected readonly city = LOCATION.name;
  protected readonly weather = toSignal(
    this.weatherApi.getCurrentWeather(LOCATION.latitude, LOCATION.longitude)
  );
}
