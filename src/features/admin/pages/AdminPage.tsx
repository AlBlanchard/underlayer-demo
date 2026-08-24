import {
  useEffect,
  useState,
} from 'react';

import DemoProgress from '@/components/layout/DemoProgress';

import {
  getDemoSession,
} from '@/services/demo.service';

import {
  subscribeToConnectionStatus,
  subscribeToDemoEvents,
  type DemoConnectionStatus,
} from '@/services/demo-sync.service';

import type {
  DemoSession,
} from '@/types/demo';

import AdminHeader from '../components/AdminHeader';
import EncodingProgress from '../components/EncodingProgress';
import QrCodePanel from '../components/QrCodePanel';
import UserConnected from '../components/UserConnected';

const AdminPage = () => {
  const [session, setSession] =
    useState<DemoSession | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [
    connectionStatus,
    setConnectionStatus,
  ] = useState<DemoConnectionStatus>(
    'connecting',
  );

  const sessionId = session?.id;

  useEffect(() => {
    let ignore = false;

    const initializeSession =
      async () => {
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

    return subscribeToConnectionStatus(
      sessionId,
      setConnectionStatus,
    );
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const unsubscribe =
      subscribeToDemoEvents(
        sessionId,
        (event) => {
          setSession(
            (currentSession) => {
              if (!currentSession) {
                return currentSession;
              }

              switch (event.type) {
                case 'viewer-connected':
                  return {
                    ...currentSession,
                    viewer:
                      event.viewer,
                    status:
                      'viewer-connected',
                  };

                case 'encoding-started':
                  return {
                    ...currentSession,
                    viewer:
                      event.viewer,
                    status:
                      'encoding',
                  };

                case 'content-ready':
                  return {
                    ...currentSession,
                    viewer:
                      event.viewer,
                    status:
                      'waiting-for-upload',
                  };
              }
            },
          );
        },
      );

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
    <div className="adminPage">
      <AdminHeader />

      {connectionStatus !==
        'connected' && (
        <div
          className="adminPage__connectionStatus"
          role="status"
        >
          {connectionStatus ===
          'connecting'
            ? 'Connecting to demo session...'
            : 'Connection lost. Reconnecting...'}
        </div>
      )}

      <main className="adminPage__main">
        <DemoProgress
          status={session.status}
        />

        <div className="adminPage__content">
          {session.status ===
            'waiting-for-viewer' && (
            <QrCodePanel
              sessionId={session.id}
            />
          )}

          {session.status ===
            'viewer-connected' &&
            session.viewer && (
              <UserConnected
                viewer={
                  session.viewer
                }
              />
            )}

          {session.status ===
            'encoding' && (
            <EncodingProgress />
          )}

        {session.status ===
          'waiting-for-upload'}

        {session.status ===
          'analysing'}

        {session.status ===
          'identified'}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;