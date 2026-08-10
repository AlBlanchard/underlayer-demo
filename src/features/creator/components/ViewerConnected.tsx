import DemoPanel from '../../../components/common/DemoPanel';
import type { Viewer } from '../../../types/demo';

interface ViewerConnectedProps {
  viewer: Viewer;
}

const ViewerConnected = ({
  viewer,
}: ViewerConnectedProps) => {
  return (
    <DemoPanel
      eyebrow="Viewer connected"
      title={`${viewer.username} joined the demo`}
      description={
        <>
          The viewer is connected and ready to receive
          protected content.
        </>
      }
    />
  );
};

export default ViewerConnected;