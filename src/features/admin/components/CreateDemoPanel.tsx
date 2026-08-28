import { useEffect, useRef, useState } from 'react';

import { QRCodeSVG } from 'qrcode.react';

import Button from '@/components/common/Button';

import { useLanguage } from '@/i18n/useLanguage';

interface CreateDemoPanelProps {
  sessionId: string;
  onClose: () => void;
}

const CLOSE_ANIMATION_DURATION = 140;
const COPY_FEEDBACK_DURATION = 2000;

const CreateDemoPanel = ({ sessionId, onClose }: CreateDemoPanelProps) => {
  const { language } = useLanguage();

  const [isCopied, setIsCopied] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  const closeTimerRef = useRef<number | null>(null);

  const copyTimerRef = useRef<number | null>(null);

  const demoUrl = `${window.location.origin}/demo/${sessionId}`;

  useEffect(() => {
    setIsClosing(false);
    setIsCopied(false);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, [sessionId]);

  const handleClose = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, CLOSE_ANIMATION_DURATION);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(demoUrl);

    setIsCopied(true);

    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, COPY_FEEDBACK_DURATION);
  };

  const panelClassName = ['createDemoPanel', isClosing ? 'createDemoPanel--closing' : null].filter(Boolean).join(' ');

  return (
    <section className={panelClassName}>
      <div className="createDemoPanel__header">
        <div>
          <span className="createDemoPanel__eyebrow">Nouvelle démonstration</span>

          <h2 className="createDemoPanel__title">Inviter un utilisateur</h2>

          <p className="createDemoPanel__description">
            Partagez ce lien avec le prospect pour démarrer la démonstration.
          </p>
        </div>

        <button
          type="button"
          className="createDemoPanel__close"
          onClick={handleClose}
          aria-label={language === 'fr' ? 'Fermer' : 'Close'}
        >
          ×
        </button>
      </div>

      <div className="createDemoPanel__share">
        <div className="createDemoPanel__qr">
          <QRCodeSVG
            value={demoUrl}
            size={180}
            level="M"
            marginSize={2}
            title={language === 'fr' ? 'QR code de la démonstration' : 'Demo QR code'}
          />
        </div>

        <div className="createDemoPanel__url">
          <span>{demoUrl}</span>
        </div>

        <Button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
        >
          {isCopied ? 'Lien copié !' : 'Copier le lien'}
        </Button>
      </div>

      <div className="createDemoPanel__session">
        <span>Session</span>

        <code>{sessionId}</code>
      </div>
    </section>
  );
};

export default CreateDemoPanel;
