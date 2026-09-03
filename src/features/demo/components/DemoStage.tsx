import type { Viewer } from '@/types/demo';

import AnalysisProgress from './AnalysisProgress';
import IdentificationResult from './IdentificationResult';
import PreparingContent from './PreparingContent';
import ProtectedContent from './ProtectedContent';
import RoleTransition from './RoleTransition';
import ScreenshotUpload from './ScreenshotUpload';
import ViewerIdentityForm from './ViewerIdentityForm';

import type { DemoStep } from '../types/demo-flow';

interface DemoStageProps {
  step: DemoStep;
  viewer: Viewer | null;
  identifiedViewer: Viewer | null;
  protectedImageUrl: string | null;
  onJoin: (username: string) => Promise<void>;
  onScreenshotTaken: () => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
  onAnalyse: (file: File) => Promise<void>;
  onRetry: () => void;
  onRestart: () => Promise<void>;
}

/**
 * Affiche le contenu correspondant à l'étape courante du parcours de démonstration.
 */
const DemoStage = ({
  step,
  viewer,
  identifiedViewer,
  protectedImageUrl,
  onJoin,
  onScreenshotTaken,
  onBack,
  onContinue,
  onAnalyse,
  onRetry,
  onRestart,
}: DemoStageProps) => {
  if (step === 'identity') {
    return <ViewerIdentityForm onSubmit={onJoin} />;
  }

  if (step === 'preparing') {
    return <PreparingContent />;
  }

  if (step === 'content' && viewer && protectedImageUrl) {
    return (
      <ProtectedContent
        viewer={viewer}
        imageUrl={protectedImageUrl}
        onScreenshotTaken={() => {
          void onScreenshotTaken();
        }}
      />
    );
  }

  if (step === 'role-transition') {
    return <RoleTransition onBack={onBack} onContinue={onContinue} />;
  }

  if (step === 'upload' && viewer) {
    return <ScreenshotUpload viewer={viewer} onAnalyse={onAnalyse} onBack={onBack} />;
  }

  if (step === 'analysing') {
    return <AnalysisProgress />;
  }

  if (step === 'result' && identifiedViewer) {
    return (
      <IdentificationResult
        viewer={identifiedViewer}
        onRetry={onRetry}
        onRestart={() => {
          void onRestart();
        }}
      />
    );
  }

  return null;
};

export default DemoStage;
