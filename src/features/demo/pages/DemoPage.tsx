import { useParams } from 'react-router';

import DemoProgress from '@/components/common/DemoProgress';
import AppHeader from '@/components/layout/AppHeader';

import { useLanguage } from '@/i18n/useLanguage';

import DemoStage from '../components/DemoStage';

import useDemoExperience from '../hooks/useDemoExperience';
import useDemoSession from '../hooks/useDemoSession';

import { getDemoProgressIndex } from '../types/demo-flow';

/**
 * Page principale du parcours de démonstration utilisateur.
 * Coordonne la session, les données métier et l'affichage des différentes étapes.
 */
const DemoPage = () => {
  const { t } = useLanguage();
  const { sessionId } = useParams();

  const { isChecking, isValid, isInvalid } = useDemoSession(sessionId);

  const {
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
  } = useDemoExperience(sessionId, isValid);

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

  if (isChecking) {
    return (
      <main className="demoPage">
        <AppHeader />

        <div className="demoPage__content">
          <p>Vérification de la session...</p>
        </div>
      </main>
    );
  }

  if (isInvalid) {
    return (
      <main className="demoPage">
        <AppHeader />

        <div className="demoPage__content">
          <div className="demoPage__invalidSession">
            <span>Session indisponible</span>

            <h1>Cette démonstration n'est plus disponible.</h1>

            <p>Ce lien a expiré ou la session a été fermée. Demandez un nouveau lien au présentateur.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="demoPage">
      <AppHeader />

      <DemoProgress
        steps={progressSteps}
        currentIndex={getDemoProgressIndex(step)}
        navigationDisabled={navigationDisabled}
        onNavigate={navigateFromProgress}
      />

      <div key={step} className={['demoPage__stage', `demoPage__stage--${navigationDirection}`].join(' ')}>
        <div className="demoPage__content">
          <DemoStage
            step={step}
            viewer={viewer}
            identifiedViewer={identifiedViewer}
            protectedImageUrl={protectedImageUrl}
            onJoin={join}
            onScreenshotTaken={confirmScreenshot}
            onBack={goBack}
            onContinue={() => {
              goToStep('upload', 'forward');
            }}
            onAnalyse={analyse}
            onRetry={retry}
            onRestart={restart}
          />
        </div>
      </div>
    </main>
  );
};

export default DemoPage;
