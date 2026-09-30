import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherCard } from './components/weather-card/weather-card';
import { WeatherMap } from './components/weather-map/weather-map';
import { Header } from './components/header/header';
import { WeatherForecast } from './components/weather-forecast/weather-forecast';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherCard, Header, WeatherMap, WeatherForecast, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})

export class App {
  protected readonly title = signal('weather-app');
}
