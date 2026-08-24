import { useState } from 'react';
import { useParams } from 'react-router';

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
  PREVIOUS_DEMO_STEP,
  type DemoStep,
} from '../types/demo-flow';

import DemoProgress from '../components/DemoProgress';
import PreparingContent from '../components/PreparingContent';
import ProtectedContent from '../components/ProtectedContent';
import ViewerIdentityForm from '../components/ViewerIdentityForm';
import RoleTransition from '../components/RoleTransition';
import AnalysisProgress from '../components/AnalysisProgress';
import IdentificationResult from '../components/IdentificationResult';
import ScreenshotUpload from '../components/ScreenshotUpload';

type NavigationDirection =
  | 'forward'
  | 'backward';

const DemoPage = () => {
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
      if (!viewer) {
        return;
      }

      goToStep('analysing', 'forward');

      try {
        const identifiedViewer =
          await analyseScreenshot(
            file,
            viewer,
          );

        setViewer(identifiedViewer);

        goToStep('result', 'forward');
      } catch (error) {
        goToStep('upload', 'forward');

        throw error;
      }
  };

  const DEMO_STEP_ORDER: DemoStep[] = [
    'identity',
    'preparing',
    'content',
    'role-transition',
    'upload',
    'analysing',
    'result',
  ];

  if (!sessionId) {
    return (
      <main className="demoPage">
        <p>Invalid demo session.</p>
      </main>
    );
  }

  return (
    <main className="demoPage">
      <DemoProgress
        currentStep={step}
        navigationDisabled={navigationDisabled}
        onNavigate={(targetStep) => {
          const targetIndex =
            DEMO_STEP_ORDER.indexOf(targetStep);

          const currentIndex =
            DEMO_STEP_ORDER.indexOf(step);

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
                  goToStep('upload', 'forward');
                }}
                onRestart={() => {
                  setViewer(null);
                  setProtectedImageUrl(
                    null,
                  );
                  goToStep('identity', 'forward');
                }}
              />
            )}
        </div>
      </div>
    </main>
  );
};

export default DemoPage;