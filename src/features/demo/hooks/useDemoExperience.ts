import { useState } from 'react';

import { analyseScreenshot, connectViewer, encodeContent } from '@/services/demo.service';
import { sendDemoEvent } from '@/services/demo-sync.service';
import { uploadScreenshot } from '@/services/demo-upload.service';

import type { Viewer } from '@/types/demo';

import useDemoFlow from './useDemoFlow';

/**
 * Hook personnalisé pour gérer les données et les actions métier
 * du parcours de démonstration.
 */
const useDemoExperience = (sessionId?: string, isSessionValid = false) => {
  const { step, navigationDirection, navigationDisabled, goToStep, goBack, navigateFromProgress, restartFlow } =
    useDemoFlow();

  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [identifiedViewer, setIdentifiedViewer] = useState<Viewer | null>(null);
  const [protectedImageUrl, setProtectedImageUrl] = useState<string | null>(null);

  const join = async (username: string) => {
    if (!sessionId || !isSessionValid) {
      return;
    }

    const connectedViewer = await connectViewer(username);

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

    const imageUrl = await encodeContent(connectedViewer);

    setProtectedImageUrl(imageUrl);

    await sendDemoEvent({
      type: 'content-ready',
      sessionId,
      viewer: connectedViewer,
    });

    goToStep('content', 'forward');
  };

  const confirmScreenshot = async () => {
    if (!sessionId || !viewer) {
      return;
    }

    await sendDemoEvent({
      type: 'creator-phase-entered',
      sessionId,
      viewer,
    });

    goToStep('role-transition', 'forward');
  };

  const analyse = async (file: File) => {
    if (!sessionId || !viewer) {
      return;
    }

    try {
      const screenshotUrl = await uploadScreenshot(file);

      await sendDemoEvent({
        type: 'screenshot-uploaded',
        sessionId,
        viewer,
        screenshotUrl,
      });

      goToStep('analysing', 'forward');

      await sendDemoEvent({
        type: 'analysis-started',
        sessionId,
        viewer,
      });

      const result = await analyseScreenshot(file, viewer);

      setIdentifiedViewer(result);

      await sendDemoEvent({
        type: 'viewer-identified',
        sessionId,
        viewer,
        identifiedViewer: result,
      });

      goToStep('result', 'forward');
    } catch (error) {
      // Revient à l'upload pour permettre une nouvelle tentative après un échec.
      goToStep('upload', 'backward');
      throw error;
    }
  };

  const retry = () => {
    setIdentifiedViewer(null);
    goToStep('upload', 'backward');
  };

  const restart = async () => {
    if (!sessionId) {
      return;
    }

    await sendDemoEvent({
      type: 'session-restarted',
      sessionId,
    });

    // Nettoie les données du parcours avant de revenir à l'identification.
    setViewer(null);
    setIdentifiedViewer(null);
    setProtectedImageUrl(null);

    restartFlow();
  };

  return {
    step,
    navigationDirection,
    navigationDisabled,

    viewer,
    identifiedViewer,
    protectedImageUrl,

    goToStep,
    goBack,
    navigateFromProgress,

    join,
    confirmScreenshot,
    analyse,
    retry,
    restart,
  };
};

export default useDemoExperience;
