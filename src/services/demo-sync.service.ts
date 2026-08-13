import type { Viewer } from '../types/demo';

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
    };

type DemoSyncListener = (
  event: DemoSyncEvent,
) => void;

const sockets = new Map<
  string,
  Promise<WebSocket>
>();

const listeners = new Map<
  string,
  Set<DemoSyncListener>
>();

const getSyncUrl = (
  sessionId: string,
) => {
  const baseUrl =
    import.meta.env.VITE_DEMO_SYNC_URL;

  if (!baseUrl) {
    throw new Error(
      'VITE_DEMO_SYNC_URL is not configured.',
    );
  }

  const url = new URL(baseUrl);

  url.searchParams.set(
    'sessionId',
    sessionId,
  );

  return url.toString();
};

const connect = (
  sessionId: string,
): Promise<WebSocket> => {
  const existingSocket =
    sockets.get(sessionId);

  if (existingSocket) {
    return existingSocket;
  }

  const socketPromise =
    new Promise<WebSocket>(
      (resolve, reject) => {
        const socket =
          new WebSocket(
            getSyncUrl(sessionId),
          );

        socket.addEventListener(
          'open',
          () => {
            resolve(socket);
          },
          {
            once: true,
          },
        );

        socket.addEventListener(
          'error',
          () => {
            sockets.delete(sessionId);

            reject(
              new Error(
                'Unable to connect to demo sync server.',
              ),
            );
          },
          {
            once: true,
          },
        );

        socket.addEventListener(
          'message',
          (message) => {
            try {
              const event =
                JSON.parse(
                  String(message.data),
                ) as DemoSyncEvent;

              const sessionListeners =
                listeners.get(sessionId);

              sessionListeners?.forEach(
                (listener) => {
                  listener(event);
                },
              );
            } catch {
              console.error(
                'Invalid demo sync message received.',
              );
            }
          },
        );

        socket.addEventListener(
          'close',
          () => {
            sockets.delete(sessionId);
          },
        );
      },
    );

  sockets.set(
    sessionId,
    socketPromise,
  );

  return socketPromise;
};

export const sendDemoEvent = async (
  event: DemoSyncEvent,
) => {
  const socket =
    await connect(event.sessionId);

  socket.send(
    JSON.stringify(event),
  );
};

export const subscribeToDemoEvents = (
  sessionId: string,
  listener: DemoSyncListener,
) => {
  const sessionListeners =
    listeners.get(sessionId) ??
    new Set<DemoSyncListener>();

  sessionListeners.add(listener);

  listeners.set(
    sessionId,
    sessionListeners,
  );

  void connect(sessionId);

  return () => {
    const currentListeners =
      listeners.get(sessionId);

    currentListeners?.delete(listener);

    if (currentListeners?.size === 0) {
      listeners.delete(sessionId);
    }
  };
};