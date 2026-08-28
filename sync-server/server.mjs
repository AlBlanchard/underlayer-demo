import { createReadStream, createWriteStream } from 'node:fs';

import { mkdir, stat, unlink } from 'node:fs/promises';

import http from 'node:http';

import { extname, join } from 'node:path';

import { randomUUID } from 'node:crypto';

import { WebSocket, WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT ?? 3000);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? '*';

const UPLOAD_DIRECTORY = join(process.cwd(), 'uploads');

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const UPLOAD_TTL = 60 * 60 * 1000;

const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const sessions = new Map();
const adminClients = new Set();
const demoSessions = new Map();

const getInitialDemoSession = (sessionId, viewer) => {
  const now = new Date().toISOString();

  return {
    id: sessionId,
    status: 'viewer-connected',

    viewer,

    protectedImageUrl: null,
    uploadedImageUrl: null,
    identifiedViewer: null,

    createdAt: now,
    updatedAt: now,
  };
};

const updateDemoSession = (event) => {
  const now = new Date().toISOString();

  const existingSession = demoSessions.get(event.sessionId);

  // Toutes les sessions sont créées via POST /sessions.
  // Un événement provenant d'une session supprimée ou inconnue est donc ignoré.
  if (!existingSession) {
    return;
  }

  switch (event.type) {
    case 'viewer-connected': {
      const session = existingSession ?? {
        ...getInitialDemoSession(event.sessionId, event.viewer),
      };

      demoSessions.set(event.sessionId, {
        ...session,
        viewer: event.viewer,
        status: 'viewer-connected',
        updatedAt: now,
      });

      break;
    }

    case 'encoding-started': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,
        status: 'encoding',
        updatedAt: now,
      });

      break;
    }

    case 'content-ready': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,
        status: 'content-ready',
        updatedAt: now,
      });

      break;
    }

    case 'creator-phase-entered': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,
        status: 'waiting-for-upload',
        updatedAt: now,
      });

      break;
    }

    case 'screenshot-uploaded': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,

        uploadedImageUrl: event.screenshotUrl,

        status: 'waiting-for-upload',

        updatedAt: now,
      });

      break;
    }

    case 'analysis-started': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,
        status: 'analysing',
        updatedAt: now,
      });

      break;
    }

    case 'viewer-identified': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,

        identifiedViewer: event.identifiedViewer,

        status: 'identified',
        updatedAt: now,
      });

      break;
    }

    case 'session-restarted': {
      if (!existingSession) {
        return;
      }

      demoSessions.set(event.sessionId, {
        ...existingSession,

        status: 'waiting-for-viewer',

        viewer: null,

        protectedImageUrl: null,
        uploadedImageUrl: null,
        identifiedViewer: null,

        updatedAt: now,
      });

      break;
    }
  }
};

const broadcastToAdmins = (message) => {
  for (const client of adminClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

await mkdir(UPLOAD_DIRECTORY, {
  recursive: true,
});

const setCorsHeaders = (response) => {
  response.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);

  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');

  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const sendJson = (response, statusCode, payload) => {
  setCorsHeaders(response);

  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
  });

  response.end(JSON.stringify(payload));
};

const scheduleFileDeletion = (filepath) => {
  const timeout = setTimeout(async () => {
    try {
      await unlink(filepath);
    } catch {
      // File already removed.
    }
  }, UPLOAD_TTL);

  timeout.unref();
};

const handleUpload = (request, response) => {
  const contentType = request.headers['content-type'];

  const extension = ALLOWED_TYPES[contentType];

  if (!extension) {
    sendJson(response, 415, {
      error: 'Unsupported image type.',
    });

    return;
  }

  const contentLength = Number(request.headers['content-length'] ?? 0);

  if (contentLength > MAX_FILE_SIZE) {
    sendJson(response, 413, {
      error: 'Image exceeds maximum size.',
    });

    return;
  }

  const filename = `${randomUUID()}${extension}`;

  const filepath = join(UPLOAD_DIRECTORY, filename);

  const fileStream = createWriteStream(filepath);

  let receivedBytes = 0;
  let aborted = false;

  request.on('data', (chunk) => {
    receivedBytes += chunk.length;

    if (receivedBytes > MAX_FILE_SIZE) {
      aborted = true;

      request.destroy();

      fileStream.destroy();

      void unlink(filepath).catch(() => undefined);
    }
  });

  request.pipe(fileStream);

  fileStream.on('finish', () => {
    if (aborted) {
      return;
    }

    scheduleFileDeletion(filepath);

    const protocol = request.headers['x-forwarded-proto'] ?? 'http';

    const host = request.headers.host;

    const imageUrl = `${protocol}://${host}/uploads/${filename}`;

    sendJson(response, 201, {
      imageUrl,
    });
  });

  fileStream.on('error', () => {
    sendJson(response, 500, {
      error: 'Unable to store image.',
    });
  });
};

const handleUploadedImage = async (filename, response) => {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');

  if (safeFilename !== filename) {
    sendJson(response, 400, {
      error: 'Invalid filename.',
    });

    return;
  }

  const filepath = join(UPLOAD_DIRECTORY, safeFilename);

  try {
    await stat(filepath);
  } catch {
    sendJson(response, 404, {
      error: 'Image not found.',
    });

    return;
  }

  const extension = extname(safeFilename).toLowerCase();

  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };

  const contentType = contentTypes[extension];

  if (!contentType) {
    sendJson(response, 415, {
      error: 'Unsupported image type.',
    });

    return;
  }

  setCorsHeaders(response);

  response.writeHead(200, {
    'Content-Type': contentType,

    'Cache-Control': 'private, max-age=3600',
  });

  createReadStream(filepath).pipe(response);
};

const server = http.createServer(async (request, response) => {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();

    return;
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);

  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, {
      status: 'ok',
    });

    return;
  }

  if (request.method === 'POST' && url.pathname === '/uploads') {
    handleUpload(request, response);

    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/uploads/')) {
    const filename = url.pathname.replace('/uploads/', '');

    await handleUploadedImage(filename, response);

    return;
  }

  if (request.method === 'POST' && url.pathname === '/sessions') {
    const sessionId = randomUUID();

    const now = new Date().toISOString();

    const session = {
      id: sessionId,

      status: 'waiting-for-viewer',

      viewer: null,

      protectedImageUrl: null,
      uploadedImageUrl: null,
      identifiedViewer: null,

      createdAt: now,
      updatedAt: now,
    };

    demoSessions.set(sessionId, session);

    sendJson(response, 201, {
      session,
    });

    return;
  }

  if (request.method === 'GET' && url.pathname === '/sessions') {
    const sessions = Array.from(demoSessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    sendJson(response, 200, {
      sessions,
    });

    return;
  }

  if (request.method === 'GET' && url.pathname.startsWith('/sessions/')) {
    const sessionId = url.pathname.replace('/sessions/', '');

    const session = demoSessions.get(sessionId);

    if (!session) {
      sendJson(response, 404, {
        error: 'Session not found.',
      });

      return;
    }

    sendJson(response, 200, {
      session,
    });

    return;
  }

  if (request.method === 'DELETE' && url.pathname.startsWith('/sessions/')) {
    const sessionId = url.pathname.replace('/sessions/', '');

    const session = demoSessions.get(sessionId);

    if (!session) {
      sendJson(response, 404, {
        error: 'Session not found.',
      });

      return;
    }

    demoSessions.delete(sessionId);

    const clients = sessions.get(sessionId);

    if (clients) {
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.close(4000, 'Session closed');
        }
      }

      sessions.delete(sessionId);
    }

    const event = {
      type: 'session-closed',
      sessionId,
    };

    broadcastToAdmins(JSON.stringify(event));

    sendJson(response, 200, {
      success: true,
    });

    return;
  }

  sendJson(response, 200, {
    service: 'Underlayer Demo Sync',
  });
});

const webSocketServer = new WebSocketServer({
  server,
});

const addClientToSession = (sessionId, socket) => {
  const clients = sessions.get(sessionId) ?? new Set();

  clients.add(socket);

  sessions.set(sessionId, clients);
};

const removeClientFromSession = (sessionId, socket) => {
  const clients = sessions.get(sessionId);

  if (!clients) {
    return;
  }

  clients.delete(socket);

  if (clients.size === 0) {
    sessions.delete(sessionId);
  }
};

const broadcastToSession = (sessionId, message, sender) => {
  const clients = sessions.get(sessionId);

  if (!clients) {
    return;
  }

  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

webSocketServer.on('connection', (socket, request) => {
  const url = new URL(request.url ?? '/', 'http://localhost');

  const role = url.searchParams.get('role');

  if (role === 'admin') {
    adminClients.add(socket);

    socket.on('close', () => {
      adminClients.delete(socket);
    });

    return;
  }

  const sessionId = url.searchParams.get('sessionId');

  if (!sessionId) {
    socket.close(1008, 'Missing sessionId');

    return;
  }

  addClientToSession(sessionId, socket);

  socket.on('message', (data) => {
    const message = data.toString();

    try {
      const event = JSON.parse(message);

      updateDemoSession(event);
    } catch {
      console.error('Invalid demo event received.');

      return;
    }

    broadcastToSession(sessionId, message, socket);

    broadcastToAdmins(message);
  });

  socket.on('close', () => {
    removeClientFromSession(sessionId, socket);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo sync server listening on port ${PORT}`);
});
