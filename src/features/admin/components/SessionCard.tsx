import { useEffect, useRef, useState } from 'react';

import DemoProgress from '@/components/common/DemoProgress';
import { useLanguage } from '@/i18n/useLanguage';

import type { AdminSession } from '../types/admin-session';
import { getAdminProgressSteps } from '../utils/admin-progress';
import { formatSessionTime } from '../utils/session-date';
import { getAdminProgressIndex } from '../utils/session-status';

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

  const progressSteps = getAdminProgressSteps(t);
  const progressIndex = getAdminProgressIndex(session.status);

  const username = session.viewer?.username ?? t.admin.session.waitingUser;
  const updatedAt = formatSessionTime(session.updatedAt, language);
  const createdAt = formatSessionTime(session.createdAt, language);
  const demoUrl = `${window.location.origin}/demo/${session.id}`;

  const statusLabels = {
    'waiting-for-viewer': t.admin.status.waitingForViewer,
    'viewer-connected': t.admin.status.viewerConnected,
    encoding: t.admin.status.encoding,
    'content-ready': t.admin.status.contentReady,
    'waiting-for-upload': t.admin.status.waitingForUpload,
    analysing: t.admin.status.analysing,
    identified: t.admin.status.identified,
    error: t.admin.status.error,
  };

  const statusLabel = statusLabels[session.status];

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(demoUrl);

    setIsCopied(true);

    if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);

    copyTimerRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, COPY_FEEDBACK_DURATION);
  };

  /**
   * Garde la carte affichée le temps de jouer l'animation avant sa suppression.
   */
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
            <span className="sessionCard__status">{statusLabel}</span>

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
          <DemoProgress steps={progressSteps} currentIndex={progressIndex} compact />
        </div>
      </summary>

      <div className="sessionCard__details">
        {session.screenshotPreviewUrl ? (
          <div className="sessionCard__preview">
            <span className="sessionCard__sectionLabel">{t.admin.session.lastScreenshot}</span>

            <img src={session.screenshotPreviewUrl} alt={t.admin.session.screenshotAlt} />
          </div>
        ) : (
          <div className="sessionCard__emptyPreview">{t.admin.session.noScreenshot}</div>
        )}

        <dl className="sessionCard__data">
          <div>
            <dt>{t.admin.session.user}</dt>
            <dd>{session.viewer?.username ?? '—'}</dd>
          </div>

          <div>
            <dt>{t.admin.session.result}</dt>
            <dd>{session.identifiedViewer?.username ?? '—'}</dd>
          </div>

          <div>
            <dt>{t.admin.session.createdAt}</dt>
            <dd>{createdAt}</dd>
          </div>
        </dl>

        {session.identifiedViewer && (
          <div className="sessionCard__result">
            <span>{t.admin.session.sourceIdentified}</span>
            <strong>{session.identifiedViewer.username}</strong>
          </div>
        )}

        <div className="sessionCard__share">
          <span className="sessionCard__sectionLabel">{t.admin.session.demoLink}</span>

          <div className="sessionCard__shareRow">
            <span className="sessionCard__url">{demoUrl}</span>

            <button
              type="button"
              className="sessionCard__copy"
              onClick={() => {
                void handleCopyUrl();
              }}
            >
              {isCopied ? t.admin.session.copied : t.admin.session.copy}
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
            {t.admin.session.close}
          </button>
        </div>
      </div>
    </details>
  );
};

export default SessionCard;
