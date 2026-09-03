import WebSocket from 'ws';

import type { DemoSyncEvent } from '../types/demo-sync-events.js';

/**
 * Gère les connexions WebSocket des sessions de démonstration et des administrateurs.
 */
class WebSocketHub {
  private readonly sessionClients = new Map<string, Set<WebSocket>>();
  private readonly adminClients = new Set<WebSocket>();

  addAdminClient(socket: WebSocket): void {
    this.adminClients.add(socket);
  }

  removeAdminClient(socket: WebSocket): void {
    this.adminClients.delete(socket);
  }

  addSessionClient(sessionId: string, socket: WebSocket): void {
    const clients = this.sessionClients.get(sessionId) ?? new Set<WebSocket>();

    clients.add(socket);
    this.sessionClients.set(sessionId, clients);
  }

  removeSessionClient(sessionId: string, socket: WebSocket): void {
    const clients = this.sessionClients.get(sessionId);

    if (!clients) {
      return;
    }

    clients.delete(socket);

    // Supprime la room lorsqu'aucun client n'y est encore connecté.
    if (clients.size === 0) {
      this.sessionClients.delete(sessionId);
    }
  }

  /**
   * Envoie un événement à tous les clients d'une session.
   * Le socket émetteur peut être exclu pour éviter de lui renvoyer son propre événement.
   */
  broadcastToSession(sessionId: string, event: DemoSyncEvent, sender: WebSocket | null = null): void {
    const clients = this.sessionClients.get(sessionId);

    if (!clients) {
      return;
    }

    const message = this.serialize(event);

    for (const client of clients) {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  broadcastToAdmins(event: DemoSyncEvent): void {
    const message = this.serialize(event);

    for (const client of this.adminClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  /**
   * Ferme tous les WebSockets associés à une session et supprime sa room.
   */
  closeSession(sessionId: string, code = 4000, reason = 'Session closed'): void {
    const clients = this.sessionClients.get(sessionId);

    if (!clients) {
      return;
    }

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN || client.readyState === WebSocket.CONNECTING) {
        client.close(code, reason);
      }
    }

    this.sessionClients.delete(sessionId);
  }

  hasSessionClients(sessionId: string): boolean {
    return this.sessionClients.has(sessionId);
  }

  private serialize(event: DemoSyncEvent): string {
    return JSON.stringify(event);
  }
}

export default WebSocketHub;
