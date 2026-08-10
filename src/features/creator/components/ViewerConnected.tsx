import type { Viewer } from '../../../types/demo';

interface ViewerConnectedProps {
  viewer: Viewer;
}

const ViewerConnected = ({
  viewer,
}: ViewerConnectedProps) => {
  return (
    <section className="viewerConnected">
      <span className="viewerConnected__step">
        Viewer connected
      </span>

      <h1 className="viewerConnected__title">
        {viewer.username} joined the demo
      </h1>

      <p className="viewerConnected__description">
        The viewer is connected and ready to receive
        protected content.
      </p>
    </section>
  );
};

export default ViewerConnected;