import {
  useEffect,
  useState,
} from 'react';

import type { DemoSession } from '../../../types/demo';

import { getDemoSession } from '../../../services/demo.service';
import { subscribeToDemoEvents } from '../../../services/demo-sync.service';


import CreatorHeader from '../components/CreatorHeader';
import QrCodePanel from '../components/QrCodePanel';
import ViewerConnected from '../components/ViewerConnected';
import WaitingForScreenshot from '../components/WaitingForScreenshot';

const CreatorPage = () => {
  const [session, setSession] =
    useState<DemoSession | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const sessionId = session?.id;

  useEffect(() => {
    let ignore = false;

    const initializeSession = async () => {
      try {
        const currentSession =
          await getDemoSession();

        if (!ignore) {
          setSession(currentSession);
        }
      } catch {
        if (!ignore) {
          setError(
            'Unable to initialize the demo session.',
          );
        }
      }
    };

    void initializeSession();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const unsubscribe =
      subscribeToDemoEvents((event) => {
        if (event.sessionId !== sessionId) {
          return;
        }

        setSession((currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          switch (event.type) {
            case 'viewer-connected':
              return {
                ...currentSession,
                viewer: event.viewer,
                status: 'viewer-connected',
              };

            case 'content-ready':
              return {
                ...currentSession,
                viewer: event.viewer,
                status: 'waiting-for-upload',
              };
          }
        });
      });

    return unsubscribe;
  }, [sessionId]);

  if (error) {
    return (
      <main>
        <p>{error}</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main>
        <p>Loading demo...</p>
      </main>
    );
  }

  return (
    <div className="creatorPage">
      <CreatorHeader />

      <main className="creatorPage__main">
        {session.status === 'waiting-for-viewer' && (
          <QrCodePanel sessionId={session.id} />
        )}

        {session.status === 'viewer-connected' &&
          session.viewer && (
            <ViewerConnected
              viewer={session.viewer}
            />
        )}

        {session.status === 'waiting-for-upload' &&
        session.viewer && (
          <WaitingForScreenshot
            viewer={session.viewer}
          />
        )}
      </main>
    </div>
  );
};

export default CreatorPage;