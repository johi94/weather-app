export const LANGUAGES = ['es', 'en', 'de'] as const;

export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  de: 'Deutsch',
};
