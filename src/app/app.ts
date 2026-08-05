import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherCard } from './components/weather-card/weather-card';
import { Header } from './components/header/header';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherCard, Header, ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('weather-app');
}
