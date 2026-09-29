import { Component, inject } from '@angular/core';
import { WeatherStore } from '../../services/weather-store';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  private readonly store = inject(WeatherStore);

  protected readonly city = this.store.city;
  protected readonly weather = this.store.weather;
}
