import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeatherStore } from '../../services/weather-store';
import { LanguageStore } from '../../services/language-store';
import { LANGUAGES, LANGUAGE_NAMES, Language } from '../../i18n/language';
import { APP_NAME } from '../../app-name';

const CITY_PATTERN = /^[\p{L}\s.'-]+$/u;
const REPEATED_CHARS = /^(.)\1+$/i;

/**
 * Form validator that rejects input made of one repeated character (e.g. "bbb"),
 * which the geocoding API would otherwise match to airport codes.
 * @returns `{ repeated: true }` if invalid, otherwise `null`.
 */
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
  private readonly languageStore = inject(LanguageStore);

  protected readonly t = this.languageStore.t;
  protected readonly languages = LANGUAGES;
  protected readonly languageNames = LANGUAGE_NAMES;
  protected readonly currentLanguage = this.languageStore.language;
  protected readonly city = this.store.city;
  protected readonly weather = this.store.weather;
  protected readonly currentConditions = this.store.currentConditions;
  protected readonly temperatureFormat = this.store.temperatureFormat;
  protected readonly query = new FormControl('', {
  nonNullable: true,
  validators: [Validators.pattern(CITY_PATTERN), notRepeated],
});

  protected setLanguage(language: Language) {
    this.languageStore.setLanguage(language);
  }

  protected readonly invalidInput = signal(false);
  protected readonly appName = APP_NAME;


  /**
   * Handles the search form submit: validates the input and starts the search,
   * or shows the validation hint if the input is empty or invalid.
   */
  protected search(event: Event) {
  event.preventDefault();
  const city = this.query.value.trim();
  const valid = !!city && this.query.valid;
  this.invalidInput.set(!valid);
  if (valid) this.store.search(city);
}
}

