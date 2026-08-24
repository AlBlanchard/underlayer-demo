import DemoProgress from '@/components/common/DemoProgress';
import { useLanguage } from '@/i18n/useLanguage';

import type {
  AdminSession,
} from '../types/admin-session';

import {
  getAdminProgressIndex,
  getSessionStatusLabel,
} from '../utils/session-status';

interface SessionCardProps {
  session: AdminSession;
}

const SessionCard = ({
  session,
}: SessionCardProps) => {
  const { t, language } = useLanguage();

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

  const username =
    session.viewer?.username ??
    (language === 'fr'
      ? 'Utilisateur en attente'
      : 'Waiting for user');

  const updatedAt =
    new Date(
      session.updatedAt,
    ).toLocaleTimeString(
      language === 'fr'
        ? 'fr-FR'
        : 'en-US',
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    );

  return (
    <details className="sessionCard">
      <summary className="sessionCard__summary">
        <div className="sessionCard__header">
          <div className="sessionCard__identity">
            <span className="sessionCard__eyebrow">
              Session
            </span>

            <h2 className="sessionCard__title">
              {username}
            </h2>
          </div>

          <div className="sessionCard__headerRight">
            <span className="sessionCard__status">
              {getSessionStatusLabel(
                session.status,
                language,
              )}
            </span>

            <span
              className="sessionCard__chevron"
              aria-hidden="true"
            >
              ↓
            </span>
          </div>
        </div>

        <div className="sessionCard__meta">
          <span>
            ID {session.id.slice(0, 8)}
          </span>

          <span>
            {updatedAt}
          </span>
        </div>

        <div className="sessionCard__progress">
          <DemoProgress
            steps={progressSteps}
            currentIndex={
              getAdminProgressIndex(
                session.status,
              )
            }
            compact
          />
        </div>
      </summary>

      <div className="sessionCard__details">
        {session.screenshotPreviewUrl ? (
          <div className="sessionCard__preview">
            <span className="sessionCard__sectionLabel">
              {language === 'fr'
                ? 'Capture analysée'
                : 'Analysed screenshot'}
            </span>

            <img
              src={
                session.screenshotPreviewUrl
              }
              alt={
                language === 'fr'
                  ? 'Capture envoyée pour analyse'
                  : 'Screenshot submitted for analysis'
              }
            />
          </div>
        ) : (
          <div className="sessionCard__emptyPreview">
            {language === 'fr'
              ? 'Aucune capture envoyée.'
              : 'No screenshot submitted.'}
          </div>
        )}

        <dl className="sessionCard__data">
          <div>
            <dt>
              {language === 'fr'
                ? 'Utilisateur'
                : 'User'}
            </dt>

            <dd>
              {session.viewer?.username ??
                '—'}
            </dd>
          </div>

          <div>
            <dt>
              {language === 'fr'
                ? 'Résultat'
                : 'Result'}
            </dt>

            <dd>
              {session.identifiedViewer
                ?.username ?? '—'}
            </dd>
          </div>

          <div>
            <dt>
              {language === 'fr'
                ? 'Créée à'
                : 'Created at'}
            </dt>

            <dd>
              {new Date(
                session.createdAt,
              ).toLocaleTimeString(
                language === 'fr'
                  ? 'fr-FR'
                  : 'en-US',
                {
                  hour: '2-digit',
                  minute: '2-digit',
                },
              )}
            </dd>
          </div>
        </dl>

        {session.identifiedViewer && (
          <div className="sessionCard__result">
            <span>
              {language === 'fr'
                ? 'Source identifiée'
                : 'Source identified'}
            </span>

            <strong>
              {
                session
                  .identifiedViewer
                  .username
              }
            </strong>
          </div>
        )}
      </div>
    </details>
  );
};

export default SessionCard;