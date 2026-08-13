import type { Viewer } from '../../../types/demo';

import Button from '../../../components/common/Button';
import ViewerProgress from './ViewerProgress';

interface ProtectedContentProps {
  viewer: Viewer;
  imageUrl: string;
  onScreenshotTaken: () => void;
}

const ProtectedContent = ({
  viewer,
  imageUrl,
  onScreenshotTaken,
}: ProtectedContentProps) => {
  return (
    <section className="protectedContent">
      <ViewerProgress currentStep={2} />

      <div className="protectedContent__content">
        <span className="protectedContent__eyebrow">
          Content ready
        </span>

        <h1 className="protectedContent__title">
          This copy is yours
        </h1>

        <p className="protectedContent__description">
          This protected image was generated for{' '}
          <strong>{viewer.username}</strong>.
        </p>

        <div className="protectedContent__instruction">
          <span className="protectedContent__instructionNumber">
            1
          </span>

          <div>
            <strong>
              Take a screenshot of the image
            </strong>

            <p>
              You can modify it afterwards.
            </p>
          </div>
        </div>

        <div className="protectedContent__imageWrapper">
          <img
            className="protectedContent__image"
            src={imageUrl}
            alt="Protected Underlayer demo content"
          />
        </div>

        <Button
          type="button"
          onClick={onScreenshotTaken}
        >
          I have my screenshot
        </Button>
      </div>
    </section>
  );
};

export default ProtectedContent;