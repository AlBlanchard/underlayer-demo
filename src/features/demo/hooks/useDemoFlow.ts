import { useState } from 'react';

import { getDemoProgressIndex, PREVIOUS_DEMO_STEP, type DemoStep } from '../types/demo-flow';

type NavigationDirection = 'forward' | 'backward';

const PROGRESS_TARGETS: readonly DemoStep[] = ['identity', 'content', 'role-transition', 'upload', 'result'];

/**
 * Hook personnalisé pour gérer le flux de démonstration, la navigation entre les étapes et leur direction.
 */
const useDemoFlow = () => {
  const [step, setStep] = useState<DemoStep>('identity');
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection>('forward');

  // Conserve la direction pour jouer l'animation adaptée lors du changement d'étape.
  const goToStep = (targetStep: DemoStep, direction: NavigationDirection) => {
    setNavigationDirection(direction);
    setStep(targetStep);
  };

  const goBack = () => {
    const previousStep = PREVIOUS_DEMO_STEP[step];

    if (!previousStep) {
      return;
    }

    goToStep(previousStep, 'backward');
  };

  // La progression expose 5 étapes visuelles alors que le flow contient aussi des étapes intermédiaires.
  const navigateFromProgress = (index: number) => {
    const targetStep = PROGRESS_TARGETS[index];

    if (!targetStep) {
      return;
    }

    const targetIndex = getDemoProgressIndex(targetStep);
    const currentIndex = getDemoProgressIndex(step);

    goToStep(targetStep, targetIndex < currentIndex ? 'backward' : 'forward');
  };

  const restartFlow = () => {
    goToStep('identity', 'backward');
  };

  return {
    step,
    navigationDirection,
    navigationDisabled: step === 'preparing' || step === 'analysing',
    goToStep,
    goBack,
    navigateFromProgress,
    restartFlow,
  };
};

export default useDemoFlow;
