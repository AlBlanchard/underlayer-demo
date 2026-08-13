import { QRCodeSVG } from 'qrcode.react';

import DemoPanel from '../../../components/common/DemoPanel';
import { getViewerDemoUrl } from '../../../services/demo-url.service';

interface QrCodePanelProps {
  sessionId: string;
}

const QrCodePanel = ({
  sessionId,
}: QrCodePanelProps) => {
  const viewerUrl = getViewerDemoUrl(sessionId);

  return (
    <DemoPanel
      className="qrPanel"
      eyebrow="Step 1"
      title="Connect a viewer"
      description={
        <>
          Scan this QR code with a mobile device
          to join the demonstration.
        </>
      }
    >
      <div className="qrPanel__code">
        <QRCodeSVG
          value={viewerUrl}
          size={220}
          level="M"
          marginSize={2}
          title="Join Underlayer demo"
        />
      </div>

      <div className="qrPanel__status">
        <span
          className="qrPanel__statusDot"
          aria-hidden="true"
        />

        <span>Waiting for viewer...</span>
      </div>

      <small className="qrPanel__session">
        Session: {sessionId}
      </small>
    </DemoPanel>
  );
};

export default QrCodePanel;