import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeatherStore } from '../../services/weather-store';

@Component({
  selector: 'app-weather-forecast',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './weather-forecast.html',
  styleUrl: './weather-forecast.scss',
})

export class WeatherForecast {
  private readonly store = inject(WeatherStore);
  protected readonly forecast = this.store.forecast;
  protected readonly temperatureFormat = this.store.temperatureFormat;
}
