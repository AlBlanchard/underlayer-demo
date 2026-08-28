import { useState, type ReactNode } from 'react';

import { DEFAULT_LANGUAGE, isLanguage, type Language } from './i18n.types';

import { LanguageContext } from './language-context';

import { translations } from './translations';

import type { Translations } from './translations.ts';

interface LanguageProviderProps {
  children: ReactNode;
}

const getInitialLanguage = (): Language => {
  const params = new URLSearchParams(window.location.search);

  const queryLanguage = params.get('lang');

  if (isLanguage(queryLanguage)) {
    return queryLanguage;
  }

  return DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] as Translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
