import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';



const AnalysisProgress = () => {
  const { t } = useLanguage();
  
  return (
    <DemoPanel
      eyebrow={t.admin.analysing.eyebrow}
      title={t.admin.analysing.title}
      description={
        <>
          {t.admin.analysing.description}
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
        {t.admin.analysing.status}
      </p>
    </DemoPanel>
  );
};

export default AnalysisProgress;