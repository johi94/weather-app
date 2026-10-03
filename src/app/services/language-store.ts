import { DOCUMENT, Service, computed, effect, inject, signal } from '@angular/core';
import { LANGUAGES, Language } from '../i18n/language';
import { TRANSLATIONS } from '../i18n/translations';

const STORAGE_KEY = 'language';
const DEFAULT_LANGUAGE: Language = 'es';

/** Checks whether a value is one of the supported languages. */
function isLanguage(value: string | null): value is Language {
  return LANGUAGES.includes(value as Language);
}

/**
 * Picks the start language: the saved choice first, then the browser language,
 * then `DEFAULT_LANGUAGE`.
 */
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
  /** All texts of the current language. Updates automatically when the language changes. */
  readonly t = computed(() => TRANSLATIONS[this.current()]);

  constructor() {
    effect(() => {
      const language = this.current();
      this.document.documentElement.lang = language;
      localStorage.setItem(STORAGE_KEY, language);
    });
  }

  /** Switches the app language; the choice is saved and `<html lang>` is updated. */
  setLanguage(language: Language) {
    this.current.set(language);
  }
}
