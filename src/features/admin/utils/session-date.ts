export const formatSessionTime = (date: string, language: 'fr' | 'en'): string => {
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};
