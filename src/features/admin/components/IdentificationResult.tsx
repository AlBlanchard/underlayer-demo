import Button from '@/components/common/Button';
import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';

import type {
  Viewer,
} from '@/types/demo';

interface IdentificationResultProps {
  viewer: Viewer;
  onRestart: () => void;
}

const IdentificationResult = ({
  viewer,
  onRestart,
}: IdentificationResultProps) => {
  const { t } = useLanguage();

  return (
    <DemoPanel
      className="identificationResult"
      eyebrow={t.admin.result.eyebrow}
      title={viewer.username}
      description={
        <>
          {t.admin.result.description}
        </>
      }
    >
      <div
        className="identificationResult__icon"
        aria-hidden="true"
      >
        ✓
      </div>

      <Button
        type="button"
        onClick={onRestart}
      >
        {t.admin.result.restart}
      </Button>
    </DemoPanel>
  );
};

export default IdentificationResult;