import { useEffect, useState } from 'react';

import { subscribeToAdminEvents } from '@/services/demo-sync.service';

import { closeDemoSession, createDemoSession, getAdminSessions } from '../services/admin-session.service';
import type { AdminSession } from '../types/admin-session';
import { applyAdminSessionEvent } from '../utils/admin-session-event';
import { toAdminSession } from '../utils/admin-session';

export const useAdminSessions = () => {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createSession = async () => {
    setIsCreating(true);

    try {
      const session = toAdminSession(await createDemoSession());

      setSessions((currentSessions) => [session, ...currentSessions]);

      return session;
    } finally {
      setIsCreating(false);
    }
  };

  const closeSession = async (sessionId: string) => {
    await closeDemoSession(sessionId);

    setSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionId));
  };

  useEffect(() => {
    let ignore = false;

    const loadSessions = async () => {
      try {
        const currentSessions = await getAdminSessions();

        if (!ignore) {
          setSessions(currentSessions.map(toAdminSession));
        }
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
      if (event.type === 'session-closed') {
        setSessions((currentSessions) => currentSessions.filter((session) => session.id !== event.sessionId));
        return;
      }

      setSessions((currentSessions) => {
        const existingSession = currentSessions.find((session) => session.id === event.sessionId);

        if (!existingSession) {
          return currentSessions;
        }

        return currentSessions.map((session) =>
          session.id === event.sessionId ? applyAdminSessionEvent(session, event) : session,
        );
      });
    });
  }, []);

  return {
    sessions,
    createSession,
    closeSession,
    isCreating,
  };
};
