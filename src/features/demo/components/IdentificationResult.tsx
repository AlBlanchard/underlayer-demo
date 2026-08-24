import Button from '@/components/common/Button';
import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';
import type { Viewer } from '@/types/demo';

interface IdentificationResultProps {
  viewer: Viewer;
  onRetry: () => void;
  onRestart: () => void;
}

const IdentificationResult = ({
  viewer,
  onRetry,
  onRestart,
}: IdentificationResultProps) => {
  const { t } = useLanguage();

  return (
    <DemoPanel
      className="identificationResult"
      eyebrow={t.user.result.eyebrow}
      title={viewer.username}
      description={
        <>
          {t.user.result.description}
        </>
      }
    >
      <div
        className="identificationResult__icon"
        aria-hidden="true"
      >
        ✓
      </div>

      <div className="identificationResult__actions">
        <Button
          type="button"
          onClick={onRetry}
        >
          {t.user.result.retry}
        </Button>

        <button
          type="button"
          className="identificationResult__restart"
          onClick={onRestart}
        >
          {t.user.result.restart}
        </button>
      </div>
    </DemoPanel>
  );
};

export default IdentificationResult;