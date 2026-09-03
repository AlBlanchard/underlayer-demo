import { createContext } from 'react';

import type { Language } from './i18n.types';

import { translations } from './translations';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.fr;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
