import {
  useState,
} from 'react';
import { useParams } from 'react-router';

import {
  connectViewer,
  encodeContent,
} from '@/services/demo.service';

import { sendDemoEvent } from '@/services/demo-sync.service';

import type {
  Viewer,
} from '@/types/demo';

import ProtectedContent from '../components/ProtectedContent';
import ViewerIdentityForm from '../components/ViewerIdentityForm';
import ScreenshotInstructions from '../components/ScreenshotInstructions';
import PreparingContent from '../components/PreparingContent';

type ViewerStep =
  | 'identity'
  | 'preparing'
  | 'content'
  | 'instructions';

const DemoPage = () => {
  const { sessionId } = useParams();

  const [viewer, setViewer] =
    useState<Viewer | null>(null);

  const [protectedImageUrl, setProtectedImageUrl] =
    useState<string | null>(null);

  const [step, setStep] =
    useState<ViewerStep>('identity');

  const handleJoin = async (
    username: string,
  ) => {
    if (!sessionId) {
      return;
    }

    const connectedViewer =
      await connectViewer(username);

    setViewer(connectedViewer);
    setStep('preparing');

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
      await encodeContent(connectedViewer);

    setProtectedImageUrl(imageUrl);

    await sendDemoEvent({
      type: 'content-ready',
      sessionId,
      viewer: connectedViewer,
    });

    setStep('content');
  };

  if (!sessionId) {
    return (
      <main>
        <p>Invalid demo session.</p>
      </main>
    );
  }

  return (
    <main className="demoPage">
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
            onScreenshotTaken={() =>
              setStep('instructions')
            }
          />
        )}

      {step === 'instructions' && (
        <ScreenshotInstructions />
      )}
    </main>
  );
};

export default DemoPage;