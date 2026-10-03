/** Supported languages; the language switcher is generated from this list. */
export const LANGUAGES = ['es', 'en', 'de'] as const;

export type Language = (typeof LANGUAGES)[number];

/** Each language's name in that language itself, so users recognize their own language. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
};
