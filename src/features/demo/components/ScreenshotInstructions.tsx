import { useLanguage } from '@/i18n/useLanguage';
import ViewerProgress from './ViewerProgress';




const ScreenshotInstructions = () => {
  const { t } = useLanguage();
  
  return (
    <section className="screenshotInstructions">
      <ViewerProgress currentStep={3} />

      <div className="screenshotInstructions__content">
        <span className="screenshotInstructions__eyebrow">
          {t.user.challenge.eyebrow}
        </span>

        <h1 className="screenshotInstructions__title">
          {t.user.challenge.title}
        </h1>

        <p className="screenshotInstructions__description">
          {t.user.challenge.description}
        </p>

        <ul className="screenshotInstructions__actions">
          <li>{t.user.challenge.crop}</li>
          <li>{t.user.challenge.contrast}</li>
          <li>{t.user.challenge.draw}</li>
          <li>{t.user.challenge.resize}</li>
        </ul>

        <div className="screenshotInstructions__next">
          <span>{t.user.challenge.next}</span>

          <strong>
            {t.user.challenge.instruction}
          </strong>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotInstructions;