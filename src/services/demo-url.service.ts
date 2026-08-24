import type {
  Language,
} from '@/i18n/i18n.types';

export const getViewerDemoUrl = (
  sessionId: string,
  language: Language,
) => {
  const url = new URL(
    `/demo/${sessionId}`,
    window.location.origin,
  );

  url.searchParams.set(
    'lang',
    language,
  );

  return url.toString();
};