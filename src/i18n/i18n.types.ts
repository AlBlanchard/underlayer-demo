export type Language = 'fr' | 'en';

export const DEFAULT_LANGUAGE: Language = 'fr';

export const isLanguage = (value: string | null): value is Language => {
  return value === 'fr' || value === 'en';
};
