import DemoPanel from '../../../components/common/DemoPanel';
import { useLanguage } from '../../../i18n/useLanguage';



const AnalysisProgress = () => {
  const { t } = useLanguage();
  
  return (
    <DemoPanel
      eyebrow={t.creator.analysing.eyebrow}
      title={t.creator.analysing.title}
      description={
        <>
          {t.creator.analysing.description}
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
        {t.creator.analysing.status}
      </p>
    </DemoPanel>
  );
};

export default AnalysisProgress;