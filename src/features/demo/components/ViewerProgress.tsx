import { useLanguage } from '@/i18n/useLanguage';

interface ViewerProgressProps {
  currentStep: 1 | 2 | 3;
}


const ViewerProgress = ({
  currentStep,
}: ViewerProgressProps) => {
  const { t } = useLanguage();

  return (
    <div
      className="viewerProgress"
      aria-label={`${t.user.progress.step} ${currentStep} ${t.user.progress.of} 3`}
    >
      <div className="viewerProgress__header">
        <span>
          {t.user.progress.step} {currentStep} {t.user.progress.of} 3
        </span>

        <span>
          Underlayer Demo
        </span>
      </div>

      <div
        className="viewerProgress__track"
        aria-hidden="true"
      >
        <span
          className="viewerProgress__value"
          style={{
            width: `${(currentStep / 3) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ViewerProgress;