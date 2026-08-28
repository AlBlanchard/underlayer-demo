import { useState } from 'react';

import type { AdminSession } from '../types/admin-session';

import { useAdminSessions } from '../hooks/useAdminSessions';

import CreateDemoPanel from '../components/CreateDemoPanel';
import AppHeader from '@/components/layout/AppHeader';
import SessionCard from '../components/SessionCard';
import Button from '@/components/common/Button';

const AdminPage = () => {
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
          <span className="adminPage__eyebrow">Administration</span>

          <h1 className="adminPage__title">Supervision des démonstrations</h1>

          <p className="adminPage__description">Suivez les sessions actives et consultez leur progression.</p>
        </section>

        <section className="adminPage__sessions">
          <div className="adminPage__sessionsHeader">
            <h2>Sessions</h2>

            <span>{sessions.length} actives</span>
          </div>

          <div className="adminPage__createButton">
            <Button
              type="button"
              disabled={isCreating}
              onClick={() => {
                void handleCreateSession();
              }}
            >
              {isCreating ? 'Création...' : 'Nouvelle démo'}
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
              <strong>Aucune session active</strong>

              <p>Les démonstrations apparaîtront ici automatiquement lorsqu'un utilisateur se connectera.</p>
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
