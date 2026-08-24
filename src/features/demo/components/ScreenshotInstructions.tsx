import { useLanguage } from '../../../i18n/useLanguage';
import ViewerProgress from './ViewerProgress';




const ScreenshotInstructions = () => {
  const { t } = useLanguage();
  
  return (
    <section className="screenshotInstructions">
      <ViewerProgress currentStep={3} />

      <div className="screenshotInstructions__content">
        <span className="screenshotInstructions__eyebrow">
          {t.viewer.challenge.eyebrow}
        </span>

        <h1 className="screenshotInstructions__title">
          {t.viewer.challenge.title}
        </h1>

        <p className="screenshotInstructions__description">
          {t.viewer.challenge.description}
        </p>

        <ul className="screenshotInstructions__actions">
          <li>{t.viewer.challenge.crop}</li>
          <li>{t.viewer.challenge.contrast}</li>
          <li>{t.viewer.challenge.draw}</li>
          <li>{t.viewer.challenge.resize}</li>
        </ul>

        <div className="screenshotInstructions__next">
          <span>{t.viewer.challenge.next}</span>

          <strong>
            {t.viewer.challenge.instruction}
          </strong>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotInstructions;