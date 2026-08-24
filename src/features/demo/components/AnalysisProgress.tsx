import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';

const AnalysisProgress = () => {
  const { t } = useLanguage();

  return (
    <DemoPanel
      className="analysisProgress"
      eyebrow={t.user.analysis.eyebrow}
      title={t.user.analysis.title}
      description={
        <>
          {t.user.analysis.description}
        </>
      }
    >
      <div
        className="analysisProgress__loader"
        aria-hidden="true"
      />

      <p
        className="analysisProgress__status"
        role="status"
      >
        {t.user.analysis.status}
      </p>
    </DemoPanel>
  );
};

export default AnalysisProgress;