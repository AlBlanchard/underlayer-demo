import {
  useEffect,
  useState,
} from 'react';

import type { DemoSession } from '../../../types/demo';

import {
  getDemoSession,
  waitForViewer,
} from '../../../services/demo.service';

import CreatorHeader from '../components/CreatorHeader';
import QrCodePanel from '../components/QrCodePanel';
import ViewerConnected from '../components/ViewerConnected';

const CreatorPage = () => {
  const [session, setSession] =
    useState<DemoSession | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const initializeSession = async () => {
      try {
        const currentSession =
          await getDemoSession();

        if (ignore) {
          return;
        }

        setSession(currentSession);

        const viewer = await waitForViewer();

        if (ignore) {
          return;
        }

        setSession((currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          return {
            ...currentSession,
            viewer,
            status: 'viewer-connected',
          };
        });
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
      </main>
    </div>
  );
};

export default CreatorPage;