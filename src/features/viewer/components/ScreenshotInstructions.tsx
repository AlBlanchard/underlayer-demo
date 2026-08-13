import ViewerProgress from './ViewerProgress';

const ScreenshotInstructions = () => {
  return (
    <section className="screenshotInstructions">
      <ViewerProgress currentStep={3} />

      <div className="screenshotInstructions__content">
        <span className="screenshotInstructions__eyebrow">
          Screenshot captured
        </span>

        <h1 className="screenshotInstructions__title">
          Now try to break it.
        </h1>

        <p className="screenshotInstructions__description">
          Modify your screenshot however you want.
          Underlayer will try to identify its source
          afterwards.
        </p>

        <ul className="screenshotInstructions__actions">
          <li>Crop the image</li>
          <li>Change contrast or brightness</li>
          <li>Draw over it</li>
          <li>Compress or resize it</li>
        </ul>

        <div className="screenshotInstructions__next">
          <span>Next</span>

          <strong>
            Send the modified screenshot back to
            the creator.
          </strong>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotInstructions;