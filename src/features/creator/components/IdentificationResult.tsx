import Button from '../../../components/common/Button';
import DemoPanel from '../../../components/common/DemoPanel';

import type {
  Viewer,
} from '../../../types/demo';

interface IdentificationResultProps {
  viewer: Viewer;
  onRestart: () => void;
}

const IdentificationResult = ({
  viewer,
  onRestart,
}: IdentificationResultProps) => {
  return (
    <DemoPanel
      className="identificationResult"
      eyebrow="Viewer identified"
      title={viewer.username}
      description={
        <>
          Underlayer successfully
          identified the viewer
          associated with this copy.
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
        Start another demo
      </Button>
    </DemoPanel>
  );
};

export default IdentificationResult;