import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
} from 'react-router';

import DemoProgress from '@/components/common/DemoProgress';
import AppHeader from '@/components/layout/AppHeader';

import { useLanguage } from '@/i18n/useLanguage';

import {
  analyseScreenshot,
  connectViewer,
  encodeContent,
  getSessionById,
} from '@/services/demo.service';

import {
  sendDemoEvent,
} from '@/services/demo-sync.service';

import {
  uploadScreenshot,
} from '@/services/demo-upload.service';

import type {
  Viewer,
} from '@/types/demo';

import AnalysisProgress from '../components/AnalysisProgress';
import IdentificationResult from '../components/IdentificationResult';
import PreparingContent from '../components/PreparingContent';
import ProtectedContent from '../components/ProtectedContent';
import RoleTransition from '../components/RoleTransition';
import ScreenshotUpload from '../components/ScreenshotUpload';
import ViewerIdentityForm from '../components/ViewerIdentityForm';

import {
  getDemoProgressIndex,
  PREVIOUS_DEMO_STEP,
  type DemoStep,
} from '../types/demo-flow';

type NavigationDirection =
  | 'forward'
  | 'backward';

type SessionState =
  | 'checking'
  | 'valid'
  | 'invalid';

const PROGRESS_TARGETS: readonly DemoStep[] = [
  'identity',
  'content',
  'role-transition',
  'upload',
  'result',
];

const DemoPage = () => {
  const { t } = useLanguage();

  const { sessionId } =
    useParams();

  const [
    sessionState,
    setSessionState,
  ] = useState<SessionState>(
    'checking',
  );

  const [
    step,
    setStep,
  ] = useState<DemoStep>(
    'identity',
  );

  const [
    viewer,
    setViewer,
  ] = useState<Viewer | null>(
    null,
  );

  const [
    identifiedViewer,
    setIdentifiedViewer,
  ] = useState<Viewer | null>(
    null,
  );

  const [
    protectedImageUrl,
    setProtectedImageUrl,
  ] = useState<string | null>(
    null,
  );

  const [
    navigationDirection,
    setNavigationDirection,
  ] =
    useState<NavigationDirection>(
      'forward',
    );

  useEffect(() => {
    if (!sessionId) {
      setSessionState(
        'invalid',
      );

      return;
    }

    let ignore = false;

    const validateSession =
      async () => {
        setSessionState(
          'checking',
        );

        try {
          await getSessionById(
            sessionId,
          );

          if (!ignore) {
            setSessionState(
              'valid',
            );
          }
        } catch {
          if (!ignore) {
            setSessionState(
              'invalid',
            );
          }
        }
      };

    void validateSession();

    return () => {
      ignore = true;
    };
  }, [sessionId]);

  const navigationDisabled =
    step === 'preparing' ||
    step === 'analysing';

  const progressSteps = [
    {
      id: 'identity',
      label:
        t.user.progress.identity,
      role: 'viewer',
    },
    {
      id: 'content',
      label:
        t.user.progress.content,
      role: 'viewer',
    },
    {
      id: 'creator',
      label:
        t.user.progress.creator,
      role: 'creator',
    },
    {
      id: 'analysis',
      label:
        t.user.progress.analysis,
      role: 'creator',
    },
    {
      id: 'result',
      label:
        t.user.progress.result,
      role: 'creator',
    },
  ] as const;

  const goToStep = (
    targetStep: DemoStep,
    direction: NavigationDirection,
  ) => {
    setNavigationDirection(
      direction,
    );

    setStep(targetStep);
  };

  const handleJoin = async (
    username: string,
  ) => {
    if (
      !sessionId ||
      sessionState !== 'valid'
    ) {
      return;
    }

    const connectedViewer =
      await connectViewer(
        username,
      );

    setViewer(
      connectedViewer,
    );

    goToStep(
      'preparing',
      'forward',
    );

    await sendDemoEvent({
      type:
        'viewer-connected',
      sessionId,
      viewer:
        connectedViewer,
    });

    await sendDemoEvent({
      type:
        'encoding-started',
      sessionId,
      viewer:
        connectedViewer,
    });

    const imageUrl =
      await encodeContent(
        connectedViewer,
      );

    setProtectedImageUrl(
      imageUrl,
    );

    await sendDemoEvent({
      type:
        'content-ready',
      sessionId,
      viewer:
        connectedViewer,
    });

    goToStep(
      'content',
      'forward',
    );
  };

  const handleScreenshotTaken =
    async () => {
      if (
        !sessionId ||
        !viewer
      ) {
        return;
      }

      await sendDemoEvent({
        type:
          'creator-phase-entered',
        sessionId,
        viewer,
      });

      goToStep(
        'role-transition',
        'forward',
      );
    };

  const handleBack = () => {
    const previousStep =
      PREVIOUS_DEMO_STEP[
        step
      ];

    if (!previousStep) {
      return;
    }

    goToStep(
      previousStep,
      'backward',
    );
  };

  const handleAnalyse =
    async (
      file: File,
    ) => {
      if (
        !viewer ||
        !sessionId
      ) {
        return;
      }

      try {
        const screenshotUrl =
          await uploadScreenshot(
            file,
          );

        await sendDemoEvent({
          type:
            'screenshot-uploaded',
          sessionId,
          viewer,
          screenshotUrl,
        });

        goToStep(
          'analysing',
          'forward',
        );

        await sendDemoEvent({
          type:
            'analysis-started',
          sessionId,
          viewer,
        });

        const result =
          await analyseScreenshot(
            file,
            viewer,
          );

        setIdentifiedViewer(
          result,
        );

        await sendDemoEvent({
          type:
            'viewer-identified',
          sessionId,
          viewer,
          identifiedViewer:
            result,
        });

        goToStep(
          'result',
          'forward',
        );
      } catch (error) {
        goToStep(
          'upload',
          'backward',
        );

        throw error;
      }
    };

  const handleRetry = () => {
    setIdentifiedViewer(
      null,
    );

    goToStep(
      'upload',
      'backward',
    );
  };

  const handleRestart =
    async () => {
      if (!sessionId) {
        return;
      }

      await sendDemoEvent({
        type:
          'session-restarted',
        sessionId,
      });

      setViewer(null);
      setIdentifiedViewer(
        null,
      );
      setProtectedImageUrl(
        null,
      );

      goToStep(
        'identity',
        'backward',
      );
    };

  const handleProgressNavigation = (
    index: number,
  ) => {
    const targetStep =
      PROGRESS_TARGETS[
        index
      ];

    if (!targetStep) {
      return;
    }

    const targetIndex =
      getDemoProgressIndex(
        targetStep,
      );

    const currentIndex =
      getDemoProgressIndex(
        step,
      );

    goToStep(
      targetStep,
      targetIndex <
        currentIndex
        ? 'backward'
        : 'forward',
    );
  };

  if (
    sessionState ===
    'checking'
  ) {
    return (
      <main className="demoPage">
        <AppHeader />

        <div className="demoPage__content">
          <p>
            Vérification de la session...
          </p>
        </div>
      </main>
    );
  }

  if (
    sessionState ===
    'invalid'
  ) {
    return (
      <main className="demoPage">
        <AppHeader />

        <div className="demoPage__content">
          <div className="demoPage__invalidSession">
            <span>
              Session indisponible
            </span>

            <h1>
              Cette démonstration
              n’est plus disponible.
            </h1>

            <p>
              Ce lien a expiré ou
              la session a été
              fermée. Demandez un
              nouveau lien au
              présentateur.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="demoPage">
      <AppHeader />

      <DemoProgress
        steps={
          progressSteps
        }
        currentIndex={
          getDemoProgressIndex(
            step,
          )
        }
        navigationDisabled={
          navigationDisabled
        }
        onNavigate={
          handleProgressNavigation
        }
      />

      <div
        key={step}
        className={[
          'demoPage__stage',
          `demoPage__stage--${navigationDirection}`,
        ].join(' ')}
      >
        <div className="demoPage__content">
          {step ===
            'identity' && (
            <ViewerIdentityForm
              onSubmit={
                handleJoin
              }
            />
          )}

          {step ===
            'preparing' && (
            <PreparingContent />
          )}

          {step ===
            'content' &&
            viewer &&
            protectedImageUrl && (
              <ProtectedContent
                viewer={
                  viewer
                }
                imageUrl={
                  protectedImageUrl
                }
                onScreenshotTaken={() => {
                  void handleScreenshotTaken();
                }}
              />
            )}

          {step ===
            'role-transition' && (
            <RoleTransition
              onBack={
                handleBack
              }
              onContinue={() => {
                goToStep(
                  'upload',
                  'forward',
                );
              }}
            />
          )}

          {step ===
            'upload' &&
            viewer && (
              <ScreenshotUpload
                viewer={
                  viewer
                }
                onAnalyse={
                  handleAnalyse
                }
                onBack={
                  handleBack
                }
              />
            )}

          {step ===
            'analysing' && (
            <AnalysisProgress />
          )}

          {step ===
            'result' &&
            identifiedViewer && (
              <IdentificationResult
                viewer={
                  identifiedViewer
                }
                onRetry={
                  handleRetry
                }
                onRestart={() => {
                  void handleRestart();
                }}
              />
            )}
        </div>
      </div>
    </main>
  );
};

export default DemoPage;