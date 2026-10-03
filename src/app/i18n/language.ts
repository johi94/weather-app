export const LANGUAGES = ['es', 'en', 'de'] as const;

export type Language = (typeof LANGUAGES)[number];
