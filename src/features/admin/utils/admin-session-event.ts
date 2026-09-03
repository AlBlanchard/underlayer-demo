import type { DemoSyncEvent } from '@/services/demo-sync.service';

import type { AdminSession } from '../types/admin-session';

/**
 * Applique un événement de démonstration à l'état d'une session Admin.
 */
export const applyAdminSessionEvent = (session: AdminSession, event: DemoSyncEvent): AdminSession => {
  const updatedAt = new Date().toISOString();

  switch (event.type) {
    case 'viewer-connected':
      return {
        ...session,
        viewer: event.viewer,
        status: 'viewer-connected',
        updatedAt,
      };

    case 'encoding-started':
      return {
        ...session,
        status: 'encoding',
        updatedAt,
      };

    case 'content-ready':
      return {
        ...session,
        status: 'content-ready',
        updatedAt,
      };

    case 'creator-phase-entered':
      return {
        ...session,
        status: 'waiting-for-upload',
        updatedAt,
      };

    case 'screenshot-uploaded':
      return {
        ...session,
        status: 'waiting-for-upload',
        uploadedImageUrl: event.screenshotUrl,
        screenshotPreviewUrl: event.screenshotUrl,
        updatedAt,
      };

    case 'analysis-started':
      return {
        ...session,
        status: 'analysing',
        updatedAt,
      };

    case 'viewer-identified':
      return {
        ...session,
        status: 'identified',
        identifiedViewer: event.identifiedViewer,
        updatedAt,
      };

    case 'session-restarted':
      return {
        ...session,
        status: 'waiting-for-viewer',
        viewer: null,
        protectedImageUrl: null,
        uploadedImageUrl: null,
        identifiedViewer: null,
        screenshotPreviewUrl: null,
        updatedAt,
      };

    case 'session-closed':
      return session;
  }
};
