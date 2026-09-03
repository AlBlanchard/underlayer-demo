import { useState } from 'react';

import Button from '@/components/common/Button';
import AppHeader from '@/components/layout/AppHeader';
import { useLanguage } from '@/i18n/useLanguage';

import CreateDemoPanel from '../components/CreateDemoPanel';
import SessionCard from '../components/SessionCard';
import { useAdminSessions } from '../hooks/useAdminSessions';
import type { AdminSession } from '../types/admin-session';

const AdminPage = () => {
  const { t } = useLanguage();

  const [createdSession, setCreatedSession] = useState<AdminSession | null>(null);

  const { sessions, createSession, closeSession, isCreating } = useAdminSessions();

  const handleCreateSession = async () => {
    try {
      const session = await createSession();
      setCreatedSession(session);
    } catch (error) {
      console.error('Unable to create demo session.', error);
    }
  };

  return (
    <div className="adminPage">
      <AppHeader />

      <main className="adminPage__main">
        <section className="adminPage__intro">
          <span className="adminPage__eyebrow">{t.admin.page.eyebrow}</span>

          <h1 className="adminPage__title">{t.admin.page.title}</h1>

          <p className="adminPage__description">{t.admin.page.description}</p>
        </section>

        <section className="adminPage__sessions">
          <div className="adminPage__sessionsHeader">
            <h2>{t.admin.page.sessions}</h2>
            <span>
              {sessions.length} {t.admin.page.active}
            </span>
          </div>

          <div className="adminPage__createButton">
            <Button
              type="button"
              disabled={isCreating}
              onClick={() => {
                void handleCreateSession();
              }}
            >
              {isCreating ? t.admin.page.creating : t.admin.page.newDemo}
            </Button>
          </div>

          {createdSession && (
            <CreateDemoPanel
              sessionId={createdSession.id}
              onClose={() => {
                setCreatedSession(null);
              }}
            />
          )}

          {sessions.length === 0 ? (
            <div className="adminPage__empty">
              <strong>{t.admin.page.emptyTitle}</strong>
              <p>{t.admin.page.emptyDescription}</p>
            </div>
          ) : (
            <div className="adminPage__grid">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClose={(sessionId) => {
                    void closeSession(sessionId);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
