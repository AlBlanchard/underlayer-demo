import type { Viewer } from '../../../types/demo';

interface IdentificationResultProps {
  viewer: Viewer;
}

const IdentificationResult = ({
  viewer,
}: IdentificationResultProps) => {
  return (
    <section className="identificationResult">
      <span className="identificationResult__step">
        Viewer identified
      </span>

      <div
        className="identificationResult__icon"
        aria-hidden="true"
      >
        ✓
      </div>

      <h1 className="identificationResult__title">
        {viewer.username}
      </h1>

      <p className="identificationResult__description">
        Underlayer successfully identified the
        viewer associated with this copy.
      </p>
    </section>
  );
};

export default IdentificationResult;