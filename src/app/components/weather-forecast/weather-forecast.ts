import { Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { WeatherStore } from '../../services/weather-store';
import { LanguageStore } from '../../services/language-store';

@Component({
  selector: 'app-weather-forecast',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './weather-forecast.html',
  styleUrl: './weather-forecast.scss',
})
export class WeatherForecast {
  private readonly languageStore = inject(LanguageStore);
  private readonly store = inject(WeatherStore);

  protected readonly language = this.languageStore.language;
  protected readonly t = this.languageStore.t;
  protected readonly forecast = this.store.forecast;
  protected readonly temperatureFormat = this.store.temperatureFormat;
}
