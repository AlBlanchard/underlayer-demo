import { useState } from 'react';
import { useParams } from 'react-router';

import { useLanguage } from '@/i18n/useLanguage';

import {
  analyseScreenshot,
  connectViewer,
  encodeContent,
} from '@/services/demo.service';

import {
  sendDemoEvent,
} from '@/services/demo-sync.service';

import type {
  Viewer,
} from '@/types/demo';

import {
  getDemoProgressIndex,
  PREVIOUS_DEMO_STEP,
} from '../types/demo-flow';

import type {
  DemoStep,
} from '../types/demo-flow';

import AppHeader from '@/components/layout/AppHeader';
import DemoProgress from '@/components/common/DemoProgress';

import PreparingContent from '../components/PreparingContent';
import ProtectedContent from '../components/ProtectedContent';
import ViewerIdentityForm from '../components/ViewerIdentityForm';
import RoleTransition from '../components/RoleTransition';
import AnalysisProgress from '../components/AnalysisProgress';
import IdentificationResult from '../components/IdentificationResult';
import ScreenshotUpload from '../components/ScreenshotUpload';

import {
  uploadScreenshot,
} from '@/services/demo-upload.service';

type NavigationDirection =
  | 'forward'
  | 'backward';

const DemoPage = () => {
  const { t } = useLanguage();
  const { sessionId } = useParams();

  const [step, setStep] =
    useState<DemoStep>('identity');

  const [viewer, setViewer] =
    useState<Viewer | null>(null);

  const [
    protectedImageUrl,
    setProtectedImageUrl,
  ] = useState<string | null>(null);

  const navigationDisabled =
    step === 'preparing' ||
    step === 'analysing';

  const [
    navigationDirection,
    setNavigationDirection,
  ] = useState<NavigationDirection>(
    'forward',
  );

  const goToStep = (
    targetStep: DemoStep,
    direction: NavigationDirection,
  ) => {
    setNavigationDirection(direction);
    setStep(targetStep);
  };

  const handleJoin = async (
    username: string,
  ) => {
    if (!sessionId) {
      return;
    }

    const connectedViewer =
      await connectViewer(username);

    setViewer(connectedViewer);
    goToStep('preparing', 'forward');

    await sendDemoEvent({
      type: 'viewer-connected',
      sessionId,
      viewer: connectedViewer,
    });

    await sendDemoEvent({
      type: 'encoding-started',
      sessionId,
      viewer: connectedViewer,
    });

    const imageUrl =
      await encodeContent(
        connectedViewer,
      );

    setProtectedImageUrl(imageUrl);

    await sendDemoEvent({
      type: 'content-ready',
      sessionId,
      viewer: connectedViewer,
    });

    goToStep('content', 'forward');
  };

  const handleBack = () => {
    const previousStep =
      PREVIOUS_DEMO_STEP[step];

    if (!previousStep) {
      return;
    }

    goToStep(
      previousStep,
      'backward',
    );
  };

  const handleAnalyse = async (
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

        console.log(
          screenshotUrl,
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

      const identifiedViewer =
        await analyseScreenshot(
          file,
          viewer,
        );

      await sendDemoEvent({
        type:
          'viewer-identified',
        sessionId,
        viewer,
        identifiedViewer,
      });

      setViewer(
        identifiedViewer,
      );

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

  const progressSteps = [
    {
      id: 'identity',
      label: t.user.progress.identity,
      role: 'viewer',
    },
    {
      id: 'content',
      label: t.user.progress.content,
      role: 'viewer',
    },
    {
      id: 'creator',
      label: t.user.progress.creator,
      role: 'creator',
    },
    {
      id: 'analysis',
      label: t.user.progress.analysis,
      role: 'creator',
    },
    {
      id: 'result',
      label: t.user.progress.result,
      role: 'creator',
    },
  ] as const;

  const progressTargets: readonly DemoStep[] = [
    'identity',
    'content',
    'role-transition',
    'upload',
    'result',
  ];

  const handleRestart = async () => {
    if (!sessionId) {
      return;
    }

    await sendDemoEvent({
      type: 'session-restarted',
      sessionId,
    });

    setViewer(null);
    setProtectedImageUrl(null);

    goToStep(
      'identity',
      'backward',
    );
  };

  if (!sessionId) {
    return (
      <main className="demoPage">
        <p>Invalid demo session.</p>
      </main>
    );
  }

  return (
    <main className="demoPage">
      <AppHeader />
        <DemoProgress
          steps={progressSteps}
          currentIndex={
            getDemoProgressIndex(step)
          }
          navigationDisabled={
            navigationDisabled
          }
          onNavigate={(index) => {
            const targetStep =
              progressTargets[index];

            if (!targetStep) {
              return;
            }

            const targetIndex =
              getDemoProgressIndex(
                targetStep,
              );

            const currentIndex =
              getDemoProgressIndex(step);

            goToStep(
              targetStep,
              targetIndex < currentIndex
                ? 'backward'
                : 'forward',
            );
          }}
        />

        <div
          key={step}
          className={[
            'demoPage__stage',
            navigationDirection === 'forward'
              ? 'demoPage__stage--forward'
              : 'demoPage__stage--backward',
          ].join(' ')}
        >

          <div className="demoPage__content">
            {step === 'identity' && (
              <ViewerIdentityForm
                onSubmit={handleJoin}
              />
            )}

            {step === 'preparing' && (
              <PreparingContent />
            )}

            {step === 'content' &&
              viewer &&
              protectedImageUrl && (
                <ProtectedContent
                  viewer={viewer}
                  imageUrl={protectedImageUrl}
                  onScreenshotTaken={() => {
                    goToStep(
                      'role-transition',
                      'forward',
                    );
                  }}
                />
              )}

            {step === 'role-transition' && (
              <RoleTransition
                onBack={handleBack}
                onContinue={() => {
                  goToStep('upload', 'forward');
                }}
              />
            )}

            {step === 'upload' &&
              viewer && (
                <ScreenshotUpload
                  viewer={viewer}
                  onAnalyse={handleAnalyse}
                  onBack={handleBack}
                />
              )}

            {step === 'analysing' && (
              <AnalysisProgress />
            )}

            {step === 'result' &&
              viewer && (
                <IdentificationResult
                  viewer={viewer}
                  onRetry={() => {
                    goToStep(
                      'upload',
                      'backward',
                    );
                  }}
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