interface QrCodePanelProps {
  sessionId: string;
}

const QrCodePanel = ({
  sessionId,
}: QrCodePanelProps) => {
  return (
    <section className="qrPanel">
      <div className="qrPanel__content">
        <span className="qrPanel__step">
          Step 1
        </span>

        <h1 className="qrPanel__title">
          Connect a viewer
        </h1>

        <p className="qrPanel__description">
          Scan this QR code with a mobile device
          to join the demonstration.
        </p>

        <div className="qrPanel__code">
          <img
            src="/demo/qr-placeholder.webp"
            alt="QR code to join the Underlayer demo"
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
      </div>
    </section>
  );
};

export default QrCodePanel;