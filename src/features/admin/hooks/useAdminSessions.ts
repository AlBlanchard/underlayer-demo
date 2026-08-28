import { useEffect, useState } from 'react';

import { subscribeToAdminEvents } from '@/services/demo-sync.service';

import { closeDemoSession, createDemoSession, getAdminSessions } from '../services/admin-session.service';

import type { AdminSession } from '../types/admin-session';

export const useAdminSessions = () => {
  const [sessions, setSessions] = useState<AdminSession[]>([]);

  const [isCreating, setIsCreating] = useState(false);

  const createSession = async () => {
    setIsCreating(true);

    try {
      const session = await createDemoSession();

      const adminSession: AdminSession = {
        ...session,
        screenshotPreviewUrl: session.uploadedImageUrl,
      };

      setSessions((currentSessions) => [adminSession, ...currentSessions]);

      return adminSession;
    } finally {
      setIsCreating(false);
    }
  };

  const updateSession = (sessionId: string, updater: (session: AdminSession) => AdminSession) => {
    setSessions((currentSessions) => {
      const existingSession = currentSessions.find((session) => session.id === sessionId);

      if (!existingSession) {
        return currentSessions;
      }

      return currentSessions.map((session) => (session.id === sessionId ? updater(session) : session));
    });
  };

  const removeSession = (sessionId: string) => {
    setSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionId));
  };

  const closeSession = async (sessionId: string) => {
    await closeDemoSession(sessionId);

    removeSession(sessionId);
  };

  useEffect(() => {
    let ignore = false;

    const loadSessions = async () => {
      try {
        const currentSessions = await getAdminSessions();

        if (ignore) {
          return;
        }

        setSessions(
          currentSessions.map((session) => ({
            ...session,

            screenshotPreviewUrl: session.uploadedImageUrl,
          })),
        );
      } catch (error) {
        console.error('Unable to load admin sessions.', error);
      }
    };

    void loadSessions();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    return subscribeToAdminEvents((event) => {
      const now = new Date().toISOString();

      switch (event.type) {
        case 'viewer-connected': {
          setSessions((currentSessions) => {
            const existing = currentSessions.some((session) => session.id === event.sessionId);

            if (existing) {
              return currentSessions.map((session) =>
                session.id === event.sessionId
                  ? {
                      ...session,
                      viewer: event.viewer,
                      status: 'viewer-connected',
                      updatedAt: now,
                    }
                  : session,
              );
            }

            const newSession: AdminSession = {
              id: event.sessionId,

              status: 'viewer-connected',

              viewer: event.viewer,

              protectedImageUrl: null,

              uploadedImageUrl: null,

              identifiedViewer: null,

              screenshotPreviewUrl: null,

              createdAt: now,

              updatedAt: now,
            };

            return [newSession, ...currentSessions];
          });

          break;
        }

        case 'encoding-started':
          updateSession(event.sessionId, (session) => ({
            ...session,
            status: 'encoding',
            updatedAt: now,
          }));

          break;

        case 'content-ready':
          updateSession(event.sessionId, (session) => ({
            ...session,
            status: 'content-ready',
            updatedAt: now,
          }));

          break;

        case 'screenshot-uploaded':
          updateSession(event.sessionId, (session) => ({
            ...session,
            status: 'waiting-for-upload',

            uploadedImageUrl: event.screenshotUrl,

            screenshotPreviewUrl: event.screenshotUrl,

            updatedAt: now,
          }));

          break;

        case 'analysis-started':
          updateSession(event.sessionId, (session) => ({
            ...session,
            status: 'analysing',
            updatedAt: now,
          }));

          break;

        case 'viewer-identified':
          updateSession(event.sessionId, (session) => ({
            ...session,
            status: 'identified',

            identifiedViewer: event.identifiedViewer,

            updatedAt: now,
          }));

          break;

        case 'session-restarted':
          updateSession(event.sessionId, (session) => ({
            ...session,

            status: 'waiting-for-viewer',

            viewer: null,

            protectedImageUrl: null,
            uploadedImageUrl: null,
            identifiedViewer: null,

            screenshotPreviewUrl: null,

            updatedAt: now,
          }));

          break;

        case 'session-closed':
          removeSession(event.sessionId);

          break;
      }
    });
  }, []);

  return {
    sessions,
    createSession,
    closeSession,
    isCreating,
  };
};
