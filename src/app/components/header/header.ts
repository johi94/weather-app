import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { WeatherStore } from '../../services/weather-store';

@Component({
  selector: 'app-header',
  imports: [DecimalPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly store = inject(WeatherStore);
  
  protected readonly city = this.store.city;
  protected readonly weather = this.store.weather;
  protected readonly temperatureFormat = this.store.temperatureFormat;
}
