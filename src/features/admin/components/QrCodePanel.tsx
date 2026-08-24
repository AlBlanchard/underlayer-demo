import { QRCodeSVG } from 'qrcode.react';

import DemoPanel from '../../../components/common/DemoPanel';
import { getViewerDemoUrl } from '../../../services/demo-url.service';
import { useLanguage } from '../../../i18n/useLanguage';

interface QrCodePanelProps {
  sessionId: string;
}



const QrCodePanel = ({
  sessionId,
}: QrCodePanelProps) => {
  const { language } = useLanguage();
  const viewerUrl = getViewerDemoUrl(sessionId, language);

  const { t } = useLanguage();

  return (
    <DemoPanel
      className="qrPanel"
      eyebrow={t.creator.qr.eyebrow}
      title={t.creator.qr.title}
      description={
        <>
          {t.creator.qr.description}
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

        <span>{t.creator.qr.waiting}</span>
      </div>

      <small className="qrPanel__session">
        Session: {sessionId}
      </small>
    </DemoPanel>
  );
};

export default QrCodePanel;