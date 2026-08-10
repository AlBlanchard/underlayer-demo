import DemoPanel from '../../../components/common/DemoPanel';
import type { Viewer } from '../../../types/demo';

interface IdentificationResultProps {
  viewer: Viewer;
}

const IdentificationResult = ({
  viewer,
}: IdentificationResultProps) => {
  return (
    <DemoPanel
      eyebrow="Viewer identified"
      title={viewer.username}
      description={
        <>
          Underlayer successfully identified the
          viewer associated with this copy.
        </>
      }
    >
      <div
        className="identificationResult__icon"
        aria-hidden="true"
      >
        ✓
      </div>
    </DemoPanel>
  );
};

export default IdentificationResult;