import { useEffect, useRef, useState } from 'react';

import DemoProgress from '@/components/common/DemoProgress';
import { useLanguage } from '@/i18n/useLanguage';

import type { AdminSession } from '../types/admin-session';

import { getAdminProgressIndex, getSessionStatusLabel } from '../utils/session-status';

interface SessionCardProps {
  session: AdminSession;
  onClose: (sessionId: string) => void;
}

const CARD_CLOSE_DURATION = 160;
const COPY_FEEDBACK_DURATION = 2000;

const SessionCard = ({ session, onClose }: SessionCardProps) => {
  const { t, language } = useLanguage();

  const [isCopied, setIsCopied] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const closeTimerRef = useRef<number | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  const progressSteps = [
    {
      id: 'identity',
      label: t.admin.progress.identity,
      role: 'viewer',
    },
    {
      id: 'content',
      label: t.admin.progress.content,
      role: 'viewer',
    },
    {
      id: 'creator',
      label: t.admin.progress.creator,
      role: 'creator',
    },
    {
      id: 'analysis',
      label: t.admin.progress.analysis,
      role: 'creator',
    },
    {
      id: 'result',
      label: t.admin.progress.result,
      role: 'creator',
    },
  ] as const;

  const username = session.viewer?.username ?? (language === 'fr' ? 'Utilisateur en attente' : 'Waiting for user');

  const locale = language === 'fr' ? 'fr-FR' : 'en-US';

  const updatedAt = new Date(session.updatedAt).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const createdAt = new Date(session.createdAt).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const demoUrl = `${window.location.origin}/demo/${session.id}`;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(demoUrl);

    setIsCopied(true);

    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }

    copyTimerRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, COPY_FEEDBACK_DURATION);
  };

  const handleCloseSession = () => {
    if (isRemoving) return;

    setIsRemoving(true);

    closeTimerRef.current = window.setTimeout(() => {
      onClose(session.id);
    }, CARD_CLOSE_DURATION);
  };

  const cardClassName = ['sessionCard', isRemoving ? 'sessionCard--removing' : null].filter(Boolean).join(' ');

  return (
    <details className={cardClassName}>
      <summary className="sessionCard__summary">
        <div className="sessionCard__header">
          <div className="sessionCard__identity">
            <span className="sessionCard__eyebrow">Session</span>

            <h2 className="sessionCard__title">{username}</h2>
          </div>

          <div className="sessionCard__headerRight">
            <span className="sessionCard__status">{getSessionStatusLabel(session.status, language)}</span>

            <span className="sessionCard__chevron" aria-hidden="true">
              ↓
            </span>
          </div>
        </div>

        <div className="sessionCard__meta">
          <span>ID {session.id.slice(0, 8)}</span>
          <span>{updatedAt}</span>
        </div>

        <div className="sessionCard__progress">
          <DemoProgress steps={progressSteps} currentIndex={getAdminProgressIndex(session.status)} compact />
        </div>
      </summary>

      <div className="sessionCard__details">
        {session.screenshotPreviewUrl ? (
          <div className="sessionCard__preview">
            <span className="sessionCard__sectionLabel">
              {language === 'fr' ? 'Dernière capture analysée' : 'Last analysed screenshot'}
            </span>

            <img
              src={session.screenshotPreviewUrl}
              alt={language === 'fr' ? 'Capture envoyée pour analyse' : 'Screenshot submitted for analysis'}
            />
          </div>
        ) : (
          <div className="sessionCard__emptyPreview">
            {language === 'fr' ? 'Aucune capture envoyée.' : 'No screenshot submitted.'}
          </div>
        )}

        <dl className="sessionCard__data">
          <div>
            <dt>{language === 'fr' ? 'Utilisateur' : 'User'}</dt>
            <dd>{session.viewer?.username ?? '—'}</dd>
          </div>

          <div>
            <dt>{language === 'fr' ? 'Résultat' : 'Result'}</dt>
            <dd>{session.identifiedViewer?.username ?? '—'}</dd>
          </div>

          <div>
            <dt>{language === 'fr' ? 'Créée à' : 'Created at'}</dt>
            <dd>{createdAt}</dd>
          </div>
        </dl>

        {session.identifiedViewer && (
          <div className="sessionCard__result">
            <span>{language === 'fr' ? 'Source identifiée' : 'Source identified'}</span>
            <strong>{session.identifiedViewer.username}</strong>
          </div>
        )}

        <div className="sessionCard__share">
          <span className="sessionCard__sectionLabel">
            {language === 'fr' ? 'Lien de la démonstration' : 'Demo link'}
          </span>

          <div className="sessionCard__shareRow">
            <span className="sessionCard__url">{demoUrl}</span>

            <button
              type="button"
              className="sessionCard__copy"
              onClick={() => {
                void handleCopyUrl();
              }}
            >
              {isCopied ? (language === 'fr' ? 'Copié !' : 'Copied!') : language === 'fr' ? 'Copier' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="sessionCard__actions">
          <button
            type="button"
            className="sessionCard__close backButton"
            onClick={handleCloseSession}
            disabled={isRemoving}
          >
            {language === 'fr' ? 'Fermer la session' : 'Close session'}
          </button>
        </div>
      </div>
    </details>
  );
};

export default SessionCard;
