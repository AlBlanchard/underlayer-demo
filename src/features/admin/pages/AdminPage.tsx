import {
  useEffect,
  useState,
} from 'react';

import DemoProgress from '../../../components/layout/DemoProgress';

import {
  analyseScreenshot,
  getDemoSession,
} from '../../../services/demo.service';

import {
  subscribeToConnectionStatus,
  subscribeToDemoEvents,
  type DemoConnectionStatus,
} from '../../../services/demo-sync.service';

import type {
  DemoSession,
} from '../../../types/demo';

import AnalysisProgress from '../components/AnalysisProgress';
import CreatorHeader from '../components/CreatorHeader';
import EncodingProgress from '../components/EncodingProgress';
import IdentificationResult from '../components/IdentificationResult';
import QrCodePanel from '../components/QrCodePanel';
import ScreenshotUpload from '../components/ScreenshotUpload';
import ViewerConnected from '../components/ViewerConnected';

const CreatorPage = () => {
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

  const handleAnalyse = async (
    file: File,
  ) => {
    if (!session?.viewer) {
      return;
    }

    const viewer =
      session.viewer;

    setSession(
      (currentSession) => {
        if (!currentSession) {
          return currentSession;
        }

        return {
          ...currentSession,
          status: 'analysing',
        };
      },
    );

    try {
      const identifiedViewer =
        await analyseScreenshot(
          file,
          viewer,
        );

      setSession(
        (currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          return {
            ...currentSession,
            viewer:
              identifiedViewer,
            status:
              'identified',
          };
        },
      );
    } catch (error) {
      setSession(
        (currentSession) => {
          if (!currentSession) {
            return currentSession;
          }

          return {
            ...currentSession,
            status:
              'waiting-for-upload',
          };
        },
      );

      throw error;
    }
  };

  const handleRestart =
    async () => {
      try {
        setError(null);

        const newSession =
          await getDemoSession();

        setSession({
          ...newSession,
          viewer: null,
          protectedImageUrl: null,
          status:
            'waiting-for-viewer',
        });
      } catch {
        setError(
          'Unable to restart the demo session.',
        );
      }
    };

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

      {connectionStatus !==
        'connected' && (
        <div
          className="creatorPage__connectionStatus"
          role="status"
        >
          {connectionStatus ===
          'connecting'
            ? 'Connecting to demo session...'
            : 'Connection lost. Reconnecting...'}
        </div>
      )}

      <main className="creatorPage__main">
        <DemoProgress
          status={session.status}
        />

        <div className="creatorPage__content">
          {session.status ===
            'waiting-for-viewer' && (
            <QrCodePanel
              sessionId={session.id}
            />
          )}

          {session.status ===
            'viewer-connected' &&
            session.viewer && (
              <ViewerConnected
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
            'waiting-for-upload' &&
            session.viewer && (
              <ScreenshotUpload
                viewer={
                  session.viewer
                }
                onAnalyse={
                  handleAnalyse
                }
              />
            )}

          {session.status ===
            'analysing' && (
            <AnalysisProgress />
          )}

          {session.status ===
            'identified' &&
            session.viewer && (
              <IdentificationResult
                viewer={
                  session.viewer
                }
                onRestart={
                  handleRestart
                }
              />
            )}
        </div>
      </main>
    </div>
  );
};

export default CreatorPage;