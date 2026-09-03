import DemoPanel from '@/components/common/DemoPanel';
import { useLanguage } from '@/i18n/useLanguage';
import type { Viewer } from '@/types/demo';

interface ViewerConnectedProps {
  viewer: Viewer;
}

const ViewerConnected = ({ viewer }: ViewerConnectedProps) => {
  const { t } = useLanguage();

  return (
    <DemoPanel
      eyebrow={t.admin.viewerConnected.eyebrow}
      title={`${viewer.username} ${t.admin.viewerConnected.title}`}
      description={<>{t.admin.viewerConnected.description}</>}
    />
  );
};

export default ViewerConnected;
