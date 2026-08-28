import {
  useState,
} from 'react';

import Button from '@/components/common/Button';

interface CreateDemoPanelProps {
  sessionId: string;
  onClose: () => void;
}

const CreateDemoPanel = ({
  sessionId,
  onClose,
}: CreateDemoPanelProps) => {
  const [isCopied, setIsCopied] =
    useState(false);

  const demoUrl =
    `${window.location.origin}/demo/${sessionId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      demoUrl,
    );

    setIsCopied(true);

    window.setTimeout(
      () => {
        setIsCopied(false);
      },
      2000,
    );
  };

  return (
    <section className="createDemoPanel">
      <div className="createDemoPanel__header">
        <div>
          <span className="createDemoPanel__eyebrow">
            Nouvelle démonstration
          </span>

          <h2 className="createDemoPanel__title">
            Inviter un utilisateur
          </h2>

          <p className="createDemoPanel__description">
            Partagez ce lien avec le prospect
            pour démarrer la démonstration.
          </p>
        </div>

        <button
          type="button"
          className="createDemoPanel__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
      </div>

      <div className="createDemoPanel__share">
        <div className="createDemoPanel__url">
          <span>
            {demoUrl}
          </span>
        </div>

        <Button
          type="button"
          onClick={() => {
            void handleCopy();
          }}
        >
          {isCopied
            ? 'Lien copié !'
            : 'Copier le lien'}
        </Button>
      </div>

      <div className="createDemoPanel__session">
        <span>
          Session
        </span>

        <code>
          {sessionId}
        </code>
      </div>
    </section>
  );
};

export default CreateDemoPanel;