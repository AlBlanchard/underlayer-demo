import http from 'node:http';

import {
  WebSocket,
  WebSocketServer,
} from 'ws';

const PORT = Number(process.env.PORT ?? 3000);

const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });

    response.end(
      JSON.stringify({
        status: 'ok',
      }),
    );

    return;
  }

  response.writeHead(200, {
    'Content-Type': 'text/plain',
  });

  response.end('Underlayer Demo Sync');
});

const webSocketServer = new WebSocketServer({
  server,
});

const sessions = new Map();

const addClientToSession = (
  sessionId,
  socket,
) => {
  const clients =
    sessions.get(sessionId) ?? new Set();

  clients.add(socket);

  sessions.set(sessionId, clients);
};

const removeClientFromSession = (
  sessionId,
  socket,
) => {
  const clients = sessions.get(sessionId);

  if (!clients) {
    return;
  }

  clients.delete(socket);

  if (clients.size === 0) {
    sessions.delete(sessionId);
  }
};

const broadcastToSession = (
  sessionId,
  message,
  sender,
) => {
  const clients = sessions.get(sessionId);

  if (!clients) {
    return;
  }

  for (const client of clients) {
    if (
      client !== sender &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(message);
    }
  }
};

webSocketServer.on(
  'connection',
  (socket, request) => {
    const url = new URL(
      request.url ?? '/',
      'http://localhost',
    );

    const sessionId =
      url.searchParams.get('sessionId');

    if (!sessionId) {
      socket.close(
        1008,
        'Missing sessionId',
      );

      return;
    }

    addClientToSession(
      sessionId,
      socket,
    );

    socket.on('message', (data) => {
      broadcastToSession(
        sessionId,
        data.toString(),
        socket,
      );
    });

    socket.on('close', () => {
      removeClientFromSession(
        sessionId,
        socket,
      );
    });
  },
);

server.listen(PORT, () => {
  console.log(
    `Demo sync server listening on port ${PORT}`,
  );
});