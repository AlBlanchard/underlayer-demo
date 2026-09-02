import { randomUUID } from 'node:crypto';

import type { DemoSession } from '../types/demo-session.js';
import type { DemoSyncEvent } from '../types/demo-sync-events.js';

/**
 * Stocke et met à jour les sessions actives de démonstration.
 */
class DemoSessionStore {
  private readonly sessions = new Map<string, DemoSession>();

  create(): DemoSession {
    const now = new Date().toISOString();

    const session: DemoSession = {
      id: randomUUID(),
      status: 'waiting-for-viewer',
      viewer: null,
      protectedImageUrl: null,
      uploadedImageUrl: null,
      identifiedViewer: null,
      createdAt: now,
      updatedAt: now,
    };

    this.sessions.set(session.id, session);

    return session;
  }

  get(sessionId: string): DemoSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  getAll(): DemoSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  has(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  delete(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Met à jour une session à partir d'un événement reçu par WebSocket.
   * Les événements liés à une session inexistante sont ignorés.
   */
  applyEvent(event: DemoSyncEvent): DemoSession | null {
    const session = this.get(event.sessionId);

    if (!session) {
      return null;
    }

    const now = new Date().toISOString();

    switch (event.type) {
      case 'viewer-connected':
        return this.update(event.sessionId, {
          viewer: event.viewer,
          status: 'viewer-connected',
          updatedAt: now,
        });

      case 'encoding-started':
        return this.update(event.sessionId, {
          status: 'encoding',
          updatedAt: now,
        });

      case 'content-ready':
        return this.update(event.sessionId, {
          status: 'content-ready',
          updatedAt: now,
        });

      case 'creator-phase-entered':
        return this.update(event.sessionId, {
          status: 'waiting-for-upload',
          updatedAt: now,
        });

      case 'screenshot-uploaded':
        return this.update(event.sessionId, {
          uploadedImageUrl: event.screenshotUrl,
          status: 'waiting-for-upload',
          updatedAt: now,
        });

      case 'analysis-started':
        return this.update(event.sessionId, {
          status: 'analysing',
          updatedAt: now,
        });

      case 'viewer-identified':
        return this.update(event.sessionId, {
          identifiedViewer: event.identifiedViewer,
          status: 'identified',
          updatedAt: now,
        });

      case 'session-restarted':
        return this.update(event.sessionId, {
          status: 'waiting-for-viewer',
          viewer: null,
          protectedImageUrl: null,
          uploadedImageUrl: null,
          identifiedViewer: null,
          updatedAt: now,
        });

      case 'session-closed':
        return session;
    }
  }

  private update(sessionId: string, changes: Partial<DemoSession>): DemoSession | null {
    const session = this.get(sessionId);

    if (!session) {
      return null;
    }

    const updatedSession: DemoSession = {
      ...session,
      ...changes,
    };

    this.sessions.set(sessionId, updatedSession);

    return updatedSession;
  }
}

export default DemoSessionStore;
