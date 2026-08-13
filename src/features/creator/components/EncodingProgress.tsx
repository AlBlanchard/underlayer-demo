import DemoPanel from '../../../components/common/DemoPanel';
import { useLanguage } from '../../../i18n/useLanguage';

const EncodingProgress = () => {
  const { t } = useLanguage();
  
  return (
    <DemoPanel
      eyebrow={t.creator.encoding.eyebrow}
      title={t.creator.encoding.title}
      description={
        <>
          {t.creator.encoding.description}
        </>
      }
    >
      <div
        className="encodingProgress__loader"
        aria-hidden="true"
      />

      <p
        className="encodingProgress__status"
        role="status"
      >
        {t.creator.encoding.status}
      </p>
    </DemoPanel>
  );
};

export default EncodingProgress;