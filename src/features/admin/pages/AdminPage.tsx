import AppHeader from '@/components/layout/AppHeader';
import SessionCard from '../components/SessionCard';

import {
  useAdminSessions,
} from '../hooks/useAdminSessions';

const AdminPage = () => {
  const {
    sessions,
  } = useAdminSessions();

  return (
    <div className="adminPage">
      <AppHeader />

      <main className="adminPage__main">
        <section className="adminPage__intro">
          <span className="adminPage__eyebrow">
            Administration
          </span>

          <h1 className="adminPage__title">
            Supervision des démonstrations
          </h1>

          <p className="adminPage__description">
            Suivez les sessions actives et
            consultez leur progression.
          </p>
        </section>

        <section className="adminPage__sessions">
          <div className="adminPage__sessionsHeader">
            <h2>
              Sessions
            </h2>

            <span>
              {sessions.length}{' '}
              actives
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="adminPage__empty">
              <strong>
                Aucune session active
              </strong>

              <p>
                Les démonstrations apparaîtront ici
                automatiquement lorsqu’un utilisateur
                se connectera.
              </p>
            </div>
          ) : (
            <div className="adminPage__grid">
              {sessions.map(
                (session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                  />
                ),
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;