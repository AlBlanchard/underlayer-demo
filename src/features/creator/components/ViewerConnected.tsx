import DemoPanel from '../../../components/common/DemoPanel';
import { useLanguage } from '../../../i18n/useLanguage';
import type { Viewer } from '../../../types/demo';

interface ViewerConnectedProps {
  viewer: Viewer;
}

const ViewerConnected = ({
  viewer,
}: ViewerConnectedProps) => {
  const { t } = useLanguage();
  
  return (
    <DemoPanel
      eyebrow={t.creator.viewerConnected.eyebrow}
      title={`${viewer.username} ${t.creator.viewerConnected.title}`}
      description={
        <>
          {t.creator.viewerConnected.description}
        </>
      }
    />
  );
};

export default ViewerConnected;