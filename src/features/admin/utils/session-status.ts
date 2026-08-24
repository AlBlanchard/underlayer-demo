import type {
  DemoStatus,
} from '@/types/demo';

export const getAdminProgressIndex = (
  status: DemoStatus,
): number => {
  switch (status) {
    case 'waiting-for-viewer':
      return 0;

    case 'viewer-connected':
    case 'encoding':
    case 'content-ready':
      return 1;

    case 'waiting-for-upload':
      return 2;

    case 'analysing':
      return 3;

    case 'identified':
      return 4;

    case 'error':
      return 0;
  }
};

export const getSessionStatusLabel = (
  status: DemoStatus,
  language: 'fr' | 'en',
) => {
  const labels = {
    fr: {
      'waiting-for-viewer': 'En attente',
      'viewer-connected': 'Connecté',
      encoding: 'Protection',
      'content-ready': 'Contenu prêt',
      'waiting-for-upload':
        'En attente de capture',
      analysing: 'Analyse',
      identified: 'Identifié',
      error: 'Erreur',
    },

    en: {
      'waiting-for-viewer': 'Waiting',
      'viewer-connected': 'Connected',
      encoding: 'Protecting',
      'content-ready': 'Content ready',
      'waiting-for-upload':
        'Waiting for screenshot',
      analysing: 'Analysing',
      identified: 'Identified',
      error: 'Error',
    },
  } as const;

  return labels[language][status];
};