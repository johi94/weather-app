import { Language } from './language';
import { Translations, es } from './es';
import { en } from './en';
import { de } from './de';

/** All dictionaries by language. Not to be confused with Angular's own `TRANSLATIONS` token. */
export const TRANSLATIONS: Record<Language, Translations> = { es, en, de };
