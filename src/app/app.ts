import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherCard } from './components/weather-card/weather-card';
import { Header } from './components/header/header';
import { Main } from './components/main/main';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherCard, Header, Main],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('weather-app');
}
