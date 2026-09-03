import type { Viewer } from '@/types/demo';

export type DemoSyncEvent =
  | {
      type: 'viewer-connected';
      sessionId: string;
      viewer: Viewer;
    }
  | {
      type: 'encoding-started';
      sessionId: string;
      viewer: Viewer;
    }
  | {
      type: 'content-ready';
      sessionId: string;
      viewer: Viewer;
    }
  | {
      type: 'creator-phase-entered';
      sessionId: string;
      viewer: Viewer;
    }
  | {
      type: 'screenshot-uploaded';
      sessionId: string;
      viewer: Viewer;
      screenshotUrl: string;
    }
  | {
      type: 'analysis-started';
      sessionId: string;
      viewer: Viewer;
    }
  | {
      type: 'viewer-identified';
      sessionId: string;
      viewer: Viewer;
      identifiedViewer: Viewer;
    }
  | {
      type: 'session-restarted';
      sessionId: string;
    }
  | {
      type: 'session-closed';
      sessionId: string;
    };

export type DemoConnectionStatus = 'connecting' | 'connected' | 'disconnected';

type DemoSyncListener = (event: DemoSyncEvent) => void;

type ConnectionListener = (status: DemoConnectionStatus) => void;

type AdminSyncListener = (event: DemoSyncEvent) => void;

let adminSocket: WebSocket | null = null;

const adminListeners = new Set<AdminSyncListener>();

interface DemoConnection {
  socket: WebSocket | null;
  eventListeners: Set<DemoSyncListener>;
  connectionListeners: Set<ConnectionListener>;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  shouldReconnect: boolean;
}

const connections = new Map<string, DemoConnection>();

const RECONNECT_DELAY = 1500;

const getSyncUrl = (sessionId: string): string => {
  const baseUrl = import.meta.env.VITE_DEMO_SYNC_URL;

  if (!baseUrl) {
    throw new Error('VITE_DEMO_SYNC_URL is not configured.');
  }

  const url = new URL(baseUrl);

  url.searchParams.set('sessionId', sessionId);

  return url.toString();
};

const notifyConnectionStatus = (connection: DemoConnection, status: DemoConnectionStatus) => {
  connection.connectionListeners.forEach((listener) => {
    listener(status);
  });
};

const getOrCreateConnection = (sessionId: string): DemoConnection => {
  const existingConnection = connections.get(sessionId);

  if (existingConnection) {
    return existingConnection;
  }

  const connection: DemoConnection = {
    socket: null,
    eventListeners: new Set<DemoSyncListener>(),
    connectionListeners: new Set<ConnectionListener>(),
    reconnectTimer: null,
    shouldReconnect: true,
  };

  connections.set(sessionId, connection);

  return connection;
};

const connect = (sessionId: string): DemoConnection => {
  const connection = getOrCreateConnection(sessionId);

  if (connection.socket?.readyState === WebSocket.OPEN || connection.socket?.readyState === WebSocket.CONNECTING) {
    return connection;
  }

  notifyConnectionStatus(connection, 'connecting');

  const socket = new WebSocket(getSyncUrl(sessionId));

  connection.socket = socket;

  socket.addEventListener('open', () => {
    notifyConnectionStatus(connection, 'connected');
  });

  socket.addEventListener('message', (message) => {
    try {
      const event = JSON.parse(String(message.data)) as DemoSyncEvent;

      connection.eventListeners.forEach((listener) => {
        listener(event);
      });
    } catch {
      console.error('Invalid demo sync message received.');
    }
  });

  socket.addEventListener('close', (event) => {
    connection.socket = null;

    notifyConnectionStatus(connection, 'disconnected');

    if (event.code === 4000) {
      connection.shouldReconnect = false;

      connection.eventListeners.forEach((listener) => {
        listener({
          type: 'session-closed',
          sessionId,
        });
      });

      return;
    }

    if (!connection.shouldReconnect) {
      return;
    }

    if (connection.reconnectTimer) {
      clearTimeout(connection.reconnectTimer);
    }

    connection.reconnectTimer = setTimeout(() => {
      connection.reconnectTimer = null;

      connect(sessionId);
    }, RECONNECT_DELAY);
  });

  socket.addEventListener('error', () => {
    socket.close();
  });

  return connection;
};

export const sendDemoEvent = async (event: DemoSyncEvent): Promise<void> => {
  const connection = connect(event.sessionId);

  const socket = connection.socket;

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(event));

    return;
  }

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error('Demo sync connection timeout.'));
    }, 5000);

    const handleOpen = () => {
      window.clearTimeout(timeout);

      connection.socket?.send(JSON.stringify(event));

      resolve();
    };

    const handleError = () => {
      window.clearTimeout(timeout);

      reject(new Error('Unable to connect to demo sync server.'));
    };

    connection.socket?.addEventListener('open', handleOpen, {
      once: true,
    });

    connection.socket?.addEventListener('error', handleError, {
      once: true,
    });
  });
};

export const subscribeToDemoEvents = (sessionId: string, listener: DemoSyncListener) => {
  const connection = connect(sessionId);

  connection.eventListeners.add(listener);

  return () => {
    connection.eventListeners.delete(listener);
  };
};

export const subscribeToConnectionStatus = (sessionId: string, listener: ConnectionListener) => {
  const connection = connect(sessionId);

  connection.connectionListeners.add(listener);

  const currentState = connection.socket?.readyState;

  if (currentState === WebSocket.OPEN) {
    listener('connected');
  } else if (currentState === WebSocket.CONNECTING) {
    listener('connecting');
  } else {
    listener('disconnected');
  }

  return () => {
    connection.connectionListeners.delete(listener);
  };
};

const getAdminSyncUrl = () => {
  const baseUrl = import.meta.env.VITE_DEMO_SYNC_URL;

  if (!baseUrl) {
    throw new Error('VITE_DEMO_SYNC_URL is not configured.');
  }

  const url = new URL(baseUrl);

  url.searchParams.set('role', 'admin');

  return url.toString();
};

const connectAdmin = () => {
  if (adminSocket?.readyState === WebSocket.OPEN || adminSocket?.readyState === WebSocket.CONNECTING) {
    return;
  }

  adminSocket = new WebSocket(getAdminSyncUrl());

  adminSocket.addEventListener('message', (message) => {
    try {
      const event = JSON.parse(String(message.data)) as DemoSyncEvent;

      adminListeners.forEach((listener) => {
        listener(event);
      });
    } catch {
      console.error('Invalid admin sync message received.');
    }
  });

  adminSocket.addEventListener('close', () => {
    adminSocket = null;

    window.setTimeout(() => {
      connectAdmin();
    }, 1500);
  });

  adminSocket.addEventListener('error', () => {
    adminSocket?.close();
  });
};

export const subscribeToAdminEvents = (listener: AdminSyncListener) => {
  adminListeners.add(listener);

  connectAdmin();

  return () => {
    adminListeners.delete(listener);
  };
};
