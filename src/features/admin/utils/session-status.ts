import type { AdminSession } from '../types/admin-session';

/**
 * Retourne l'étape de progression correspondant à l'état actuel d'une session.
 */
export const getAdminProgressIndex = (status: AdminSession['status']): number => {
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
