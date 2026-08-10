import {
  useEffect,
  useState,
} from 'react';

import type { DemoSession } from '../../../types/demo';

import type { DemoSyncEvent } from '../../../services/demo-sync.service';


import { getDemoSession } from '../../../services/demo.service';
import { createDemoChannel } from '../../../services/demo-sync.service';


import CreatorHeader from '../components/CreatorHeader';
import QrCodePanel from '../components/QrCodePanel';
import ViewerConnected from '../components/ViewerConnected';

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

    const channel = createDemoChannel();

    const handleMessage = (
      event: MessageEvent<DemoSyncEvent>,
    ) => {
      const message = event.data;

      if (
        message.type !== 'viewer-connected' ||
        message.sessionId !== sessionId
      ) {
        return;
      }

      setSession((currentSession) => {
        if (!currentSession) {
          return currentSession;
        }

        return {
          ...currentSession,
          viewer: message.viewer,
          status: 'viewer-connected',
        };
      });
    };

    channel.addEventListener(
      'message',
      handleMessage,
    );

    return () => {
      channel.removeEventListener(
        'message',
        handleMessage,
      );

      channel.close();
    };
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
      </main>
    </div>
  );
};

export default CreatorPage;