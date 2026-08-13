import {
  useEffect,
  useState,
} from 'react';

import type { DemoSession } from '../../../types/demo';

import { getDemoSession } from '../../../services/demo.service';
import { subscribeToDemoEvents } from '../../../services/demo-sync.service';
import { analyseScreenshot } from '../../../services/demo.service';


import CreatorHeader from '../components/CreatorHeader';
import QrCodePanel from '../components/QrCodePanel';
import ViewerConnected from '../components/ViewerConnected';
import ScreenshotUpload from '../components/ScreenshotUpload';
import AnalysisProgress from '../components/AnalysisProgress';
import IdentificationResult from '../components/IdentificationResult';
import DemoProgress from '../../../components/layout/DemoProgress';
import EncodingProgress from '../components/EncodingProgress';

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
                    viewer: event.viewer,
                    status:
                      'viewer-connected',
                  };

                case 'encoding-started':
                  return {
                    ...currentSession,
                    viewer: event.viewer,
                    status: 'encoding',
                  };

                case 'content-ready':
                  return {
                    ...currentSession,
                    viewer: event.viewer,
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

  const handleAnalyse = async (file: File) => {
    if (!session?.viewer) {
      return;
    }

    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      return {
        ...currentSession,
        status: 'analysing',
      };
    });

    try {
      const identifiedViewer =
        await analyseScreenshot(
          file,
          session.viewer,
        );

      setSession((currentSession) => {
        if (!currentSession) {
          return currentSession;
        }

        return {
          ...currentSession,
          viewer: identifiedViewer,
          status: 'identified',
        };
      });
    } catch (error) {
      setSession((currentSession) => {
        if (!currentSession) {
          return currentSession;
        }

        return {
          ...currentSession,
          status: 'waiting-for-upload',
        };
      });

      throw error;
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

      <main className="creatorPage__main">
        <DemoProgress status={session.status} />

        <div className="creatorPage__content"> 
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
              <ScreenshotUpload
                viewer={session.viewer}
                onAnalyse={handleAnalyse}
              />
          )}

          {session.status === 'analysing' && (
            <AnalysisProgress />
          )}

          {session.status === 'identified' &&
            session.viewer && (
              <IdentificationResult
                viewer={session.viewer}
              />
          )}

          {session.status === 'encoding' && (
            <EncodingProgress />
          )}
        </div>
      </main>
    </div>
  );
};

export default CreatorPage;