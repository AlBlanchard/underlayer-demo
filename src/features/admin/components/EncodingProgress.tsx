import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';

const EncodingProgress = () => {
  const { t } = useLanguage();

  return (
    <DemoPanel
      eyebrow={t.admin.encoding.eyebrow}
      title={t.admin.encoding.title}
      description={<>{t.admin.encoding.description}</>}
    >
      <div className="encodingProgress__loader" aria-hidden="true" />

      <p className="encodingProgress__status" role="status">
        {t.admin.encoding.status}
      </p>
    </DemoPanel>
  );
};

export default EncodingProgress;
