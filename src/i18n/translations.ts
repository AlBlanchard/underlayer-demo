import { en } from './translations/en';
import { fr } from './translations/fr';

export const translations = {
  fr,
  en,
} as const;

export type Translations = typeof translations.fr;
