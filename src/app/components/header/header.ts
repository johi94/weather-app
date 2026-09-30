import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeatherStore } from '../../services/weather-store';

const CITY_PATTERN = /^[\p{L}\s.'-]+$/u;
const REPEATED_CHARS = /^(.)\1+$/i;

function notRepeated(control: AbstractControl) {
  return REPEATED_CHARS.test(control.value.trim()) ? { repeated: true } : null;
}

@Component({
  selector: 'app-header',
  imports: [DecimalPipe, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly store = inject(WeatherStore);

  protected readonly city = this.store.city;
  protected readonly weather = this.store.weather;
  protected readonly currentConditions = this.store.currentConditions;
  protected readonly temperatureFormat = this.store.temperatureFormat;
  protected readonly query = new FormControl('', {
  nonNullable: true,
  validators: [Validators.pattern(CITY_PATTERN), notRepeated],
});

  protected readonly invalidInput = signal(false);

  protected search(event: Event) {
  event.preventDefault();
  const city = this.query.value.trim();
  const valid = !!city && this.query.valid;
  this.invalidInput.set(!valid);
  if (valid) this.store.search(city);
}
}

