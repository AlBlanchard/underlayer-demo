import type { Viewer } from '../../../types/demo';

interface WaitingForScreenshotProps {
  viewer: Viewer;
}

const WaitingForScreenshot = ({
  viewer,
}: WaitingForScreenshotProps) => {
  return (
    <section className="waitingScreenshot">
      <span className="waitingScreenshot__step">
        Content delivered
      </span>

      <h1 className="waitingScreenshot__title">
        Protected content sent
      </h1>

      <p className="waitingScreenshot__description">
        The protected image has been delivered to{' '}
        <strong>{viewer.username}</strong>.
      </p>

      <div className="waitingScreenshot__status">
        <span
          className="waitingScreenshot__statusDot"
          aria-hidden="true"
        />

        Waiting for a leaked screenshot...
      </div>
    </section>
  );
};

export default WaitingForScreenshot;