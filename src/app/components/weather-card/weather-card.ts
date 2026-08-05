import { Component } from '@angular/core';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})

export class WeatherCard {
  protected readonly city = 'Berlin';
  protected readonly temperature = 22;
}

