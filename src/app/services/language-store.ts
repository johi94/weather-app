import { DOCUMENT, Service, computed, effect, inject, signal } from '@angular/core';
import { LANGUAGES, Language } from '../i18n/language';
import { TRANSLATIONS } from '../i18n/translations';

const STORAGE_KEY = 'language';
const DEFAULT_LANGUAGE: Language = 'es';

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.includes(value as Language);
}

function detectLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (isLanguage(saved)) return saved;
  const browserLanguage = navigator.language.slice(0, 2);
  return isLanguage(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE;
}

@Service()
export class LanguageStore {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal(detectLanguage());

  readonly language = this.current.asReadonly();
  readonly t = computed(() => TRANSLATIONS[this.current()]);

  constructor() {
    effect(() => {
      const language = this.current();
      this.document.documentElement.lang = language;
      localStorage.setItem(STORAGE_KEY, language);
    });
  }

  setLanguage(language: Language) {
    this.current.set(language);
  }
}
