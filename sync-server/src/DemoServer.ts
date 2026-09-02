import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import { join } from 'node:path';

import WebSocket, { type RawData, WebSocketServer } from 'ws';

import HttpRequest from './http/HttpRequest.js';
import HttpResponse from './http/HttpResponse.js';
import HttpError from './http/HttpError.js';
import DemoSessionStore from './sessions/DemoSessionStore.js';
import type { DemoSyncEvent } from './types/demo-sync-events.js';
import UploadCleaner from './uploads/UploadCleaner.js';
import UploadService from './uploads/UploadService.js';
import WebSocketHub from './websocket/WebSocketHub.js';

/**
 * Orchestre le serveur HTTP, les sessions de démonstration,
 * les uploads temporaires et les connexions WebSocket.
 */
class DemoServer {
  private readonly port: number;
  private readonly frontendOrigin: string;

  private readonly sessionStore: DemoSessionStore;
  private readonly uploadService: UploadService;
  private readonly uploadCleaner: UploadCleaner;
  private readonly webSocketHub: WebSocketHub;
  private readonly httpResponse: HttpResponse;

  private readonly server: http.Server;
  private readonly webSocketServer: WebSocketServer;

  constructor() {
    this.port = Number(process.env.PORT ?? 3000);
    this.frontendOrigin = process.env.FRONTEND_ORIGIN ?? '*';

    this.sessionStore = new DemoSessionStore();
    this.uploadService = new UploadService(join(process.cwd(), 'uploads'));
    this.uploadCleaner = new UploadCleaner(this.uploadService, this.sessionStore);
    this.webSocketHub = new WebSocketHub();
    this.httpResponse = new HttpResponse(this.frontendOrigin);

    this.server = http.createServer((request, response) => {
      void this.handleHttpRequest(request, response);
    });

    this.webSocketServer = new WebSocketServer({
      server: this.server,
    });

    this.registerWebSocketHandlers();
  }

  /**
   * Initialise les services, nettoie les uploads obsolètes puis démarre le serveur.
   */
  async start(): Promise<void> {
    await this.uploadService.initialize();
    await this.uploadCleaner.cleanOnStartup();

    this.server.listen(this.port, '0.0.0.0', () => {
      console.log(`Demo sync server listening on port ${this.port}`);
    });
  }

  /**
   * Route les requêtes HTTP vers la fonctionnalité correspondante.
   */
  private async handleHttpRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    try {
      if (request.method === 'OPTIONS') {
        this.httpResponse.empty(response);
        return;
      }

      const url = HttpRequest.getUrl(request);

      if (request.method === 'GET' && url.pathname === '/health') {
        this.handleHealth(response);
        return;
      }

      if (request.method === 'POST' && url.pathname === '/uploads') {
        await this.handleUpload(request, response);
        return;
      }

      if (request.method === 'GET' && url.pathname.startsWith('/uploads/')) {
        await this.handleUploadedImage(url, response);
        return;
      }

      if (request.method === 'POST' && url.pathname === '/sessions') {
        this.handleCreateSession(response);
        return;
      }

      if (request.method === 'GET' && url.pathname === '/sessions') {
        this.handleGetSessions(response);
        return;
      }

      if (request.method === 'GET' && url.pathname.startsWith('/sessions/')) {
        this.handleGetSession(url, response);
        return;
      }

      if (request.method === 'DELETE' && url.pathname.startsWith('/sessions/')) {
        await this.handleDeleteSession(url, response);
        return;
      }

      this.httpResponse.json(response, 200, {
        service: 'Underlayer Demo Sync',
      });
    } catch (error) {
      this.httpResponse.error(response, error);
    }
  }

  private handleHealth(response: ServerResponse): void {
    this.httpResponse.json(response, 200, {
      status: 'ok',
    });
  }

  private async handleUpload(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const filename = await this.uploadService.store(request);

    // Render transmet le protocole original via X-Forwarded-Proto.
    const forwardedProtocol = request.headers['x-forwarded-proto'];
    const protocol = Array.isArray(forwardedProtocol) ? forwardedProtocol[0] : (forwardedProtocol ?? 'http');
    const host = request.headers.host;

    if (!host) {
      throw new HttpError(400, 'Missing Host header.');
    }

    const imageUrl = `${protocol}://${host}/uploads/${filename}`;

    this.httpResponse.json(response, 201, {
      imageUrl,
    });
  }

  private async handleUploadedImage(url: URL, response: ServerResponse): Promise<void> {
    const filename = HttpRequest.getPathParameter(url.pathname, '/uploads/');

    if (!filename) {
      throw new HttpError(404, 'Image not found.');
    }

    const file = await this.uploadService.getFile(filename);
    const stream = this.uploadService.createReadStream(file.filepath);

    this.httpResponse.stream(response, stream, file.contentType);
  }

  private handleCreateSession(response: ServerResponse): void {
    const session = this.sessionStore.create();

    this.httpResponse.json(response, 201, {
      session,
    });
  }

  private handleGetSessions(response: ServerResponse): void {
    this.httpResponse.json(response, 200, {
      sessions: this.sessionStore.getAll(),
    });
  }

  private handleGetSession(url: URL, response: ServerResponse): void {
    const sessionId = HttpRequest.getPathParameter(url.pathname, '/sessions/');
    const session = sessionId ? this.sessionStore.get(sessionId) : null;

    if (!session) {
      throw new HttpError(404, 'Session not found.');
    }

    this.httpResponse.json(response, 200, {
      session,
    });
  }

  private async handleDeleteSession(url: URL, response: ServerResponse): Promise<void> {
    const sessionId = HttpRequest.getPathParameter(url.pathname, '/sessions/');
    const session = sessionId ? this.sessionStore.get(sessionId) : null;

    if (!session || !sessionId) {
      throw new HttpError(404, 'Session not found.');
    }

    const event: DemoSyncEvent = {
      type: 'session-closed',
      sessionId,
    };

    // Informe les clients avant de fermer leurs sockets afin d'invalider immédiatement la démo.
    this.webSocketHub.broadcastToSession(sessionId, event);
    this.webSocketHub.broadcastToAdmins(event);

    await this.uploadCleaner.cleanSession(sessionId);

    this.sessionStore.delete(sessionId);
    this.webSocketHub.closeSession(sessionId);

    this.httpResponse.json(response, 200, {
      success: true,
    });
  }

  /**
   * Enregistre le point d'entrée de toutes les connexions WebSocket.
   */
  private registerWebSocketHandlers(): void {
    this.webSocketServer.on('connection', (socket, request) => {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const role = url.searchParams.get('role');

      if (role === 'admin') {
        this.handleAdminConnection(socket);
        return;
      }

      const sessionId = url.searchParams.get('sessionId');

      this.handleSessionConnection(socket, sessionId);
    });
  }

  private handleAdminConnection(socket: WebSocket): void {
    this.webSocketHub.addAdminClient(socket);

    socket.on('close', () => {
      this.webSocketHub.removeAdminClient(socket);
    });
  }

  private handleSessionConnection(socket: WebSocket, sessionId: string | null): void {
    if (!sessionId) {
      socket.close(1008, 'Missing sessionId');
      return;
    }

    // Une session supprimée ne doit jamais pouvoir rouvrir un canal WebSocket.
    if (!this.sessionStore.has(sessionId)) {
      socket.close(4000, 'Session closed');
      return;
    }

    this.webSocketHub.addSessionClient(sessionId, socket);

    socket.on('message', (data) => {
      void this.handleSessionMessage(socket, sessionId, data);
    });

    socket.on('close', () => {
      this.webSocketHub.removeSessionClient(sessionId, socket);
    });
  }

  private async handleSessionMessage(socket: WebSocket, sessionId: string, data: RawData): Promise<void> {
    // Un socket encore vivant après suppression de sa session est immédiatement invalidé.
    if (!this.sessionStore.has(sessionId)) {
      socket.close(4000, 'Session closed');
      return;
    }

    const event = this.parseDemoEvent(data);

    if (!event) {
      console.error('Invalid demo event received.');
      return;
    }

    // Un client ne peut publier des événements que pour la session à laquelle il est connecté.
    if (event.sessionId !== sessionId) {
      socket.close(1008, 'Invalid session');
      return;
    }

    if (event.type === 'session-restarted') {
      await this.uploadCleaner.cleanSession(sessionId);
    }

    this.sessionStore.applyEvent(event);

    this.webSocketHub.broadcastToSession(sessionId, event, socket);
    this.webSocketHub.broadcastToAdmins(event);
  }

  /**
   * Convertit les données WebSocket reçues en événement de démonstration.
   *
   * Le typage TypeScript protège le code après parsing, mais ne valide pas encore
   * la structure JSON reçue à l'exécution.
   */
  private parseDemoEvent(data: RawData): DemoSyncEvent | null {
    try {
      return JSON.parse(data.toString()) as DemoSyncEvent;
    } catch {
      return null;
    }
  }
}

export default DemoServer;
