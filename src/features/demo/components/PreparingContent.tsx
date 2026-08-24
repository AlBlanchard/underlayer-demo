import { useLanguage } from '@/i18n/useLanguage';
import ViewerProgress from './ViewerProgress';

const PreparingContent = () => {
  const { t } = useLanguage();
  
  return (
    <section className="preparingContent">
      <ViewerProgress currentStep={2} />

      <div className="preparingContent__content">
        <div
          className="preparingContent__loader"
          aria-hidden="true"
        />

        <h1 className="preparingContent__title">
          {t.user.preparing.title}
        </h1>

        <p
          className="preparingContent__description"
          role="status"
        >
          {t.user.preparing.description}
        </p>
      </div>
    </section>
  );
};

export default PreparingContent;