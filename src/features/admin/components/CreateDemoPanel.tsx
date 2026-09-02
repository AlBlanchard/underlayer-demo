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
  const { t } = useLanguage();

  const [isCopied, setIsCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const demoUrl = `${window.location.origin}/demo/${sessionId}`;

  useEffect(() => {
    setIsClosing(false);
    setIsCopied(false);

    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, [sessionId]);

  /**
   * Garde le panneau affiché le temps de jouer l'animation de fermeture.
   */
  const handleClose = () => {
    if (isClosing) return;

    setIsClosing(true);

    closeTimerRef.current = window.setTimeout(() => {
      onClose();
    }, CLOSE_ANIMATION_DURATION);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(demoUrl);

    setIsCopied(true);

    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);

    copyTimerRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, COPY_FEEDBACK_DURATION);
  };

  const panelClassName = ['createDemoPanel', isClosing ? 'createDemoPanel--closing' : null].filter(Boolean).join(' ');

  return (
    <section className={panelClassName}>
      <div className="createDemoPanel__header">
        <div>
          <span className="createDemoPanel__eyebrow">{t.admin.createDemo.eyebrow}</span>

          <h2 className="createDemoPanel__title">{t.admin.createDemo.title}</h2>

          <p className="createDemoPanel__description">{t.admin.createDemo.description}</p>
        </div>

        <button
          type="button"
          className="createDemoPanel__close"
          onClick={handleClose}
          aria-label={t.admin.createDemo.close}
        >
          ×
        </button>
      </div>

      <div className="createDemoPanel__share">
        <div className="createDemoPanel__qr">
          <QRCodeSVG value={demoUrl} size={180} level="M" marginSize={2} title={t.admin.createDemo.qrTitle} />
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
          {isCopied ? t.admin.createDemo.copied : t.admin.createDemo.copy}
        </Button>
      </div>

      <div className="createDemoPanel__session">
        <span>{t.admin.createDemo.session}</span>
        <code>{sessionId}</code>
      </div>
    </section>
  );
};

export default CreateDemoPanel;
