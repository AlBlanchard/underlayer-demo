import { useEffect, useState } from 'react';

import { subscribeToDemoEvents } from '@/services/demo-sync.service';
import { getSessionById } from '@/services/demo.service';

export type SessionState = 'checking' | 'valid' | 'invalid';

const useDemoSession = (sessionId?: string) => {
  const [sessionState, setSessionState] = useState<SessionState>('checking');

  // Vérifie que le lien pointe toujours vers une session active.
  useEffect(() => {
    if (!sessionId) {
      setSessionState('invalid');
      return;
    }

    let ignore = false;

    const validateSession = async () => {
      setSessionState('checking');

      try {
        await getSessionById(sessionId);

        if (!ignore) {
          setSessionState('valid');
        }
      } catch {
        if (!ignore) {
          setSessionState('invalid');
        }
      }
    };

    void validateSession();

    return () => {
      ignore = true;
    };
  }, [sessionId]);

  // Le serveur reste l'autorité : une session fermée invalide immédiatement le parcours en cours.
  useEffect(() => {
    if (!sessionId || sessionState !== 'valid') {
      return;
    }

    const unsubscribe = subscribeToDemoEvents(sessionId, (event) => {
      if (event.type === 'session-closed') {
        setSessionState('invalid');
      }
    });

    return unsubscribe;
  }, [sessionId, sessionState]);

  return {
    sessionState,
    isChecking: sessionState === 'checking',
    isValid: sessionState === 'valid',
    isInvalid: sessionState === 'invalid',
  };
};

export default useDemoSession;
