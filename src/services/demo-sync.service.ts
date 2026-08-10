import type { Viewer } from '../types/demo';

const CHANNEL_NAME = 'underlayer-demo';

export type DemoSyncEvent =
  | {
      type: 'viewer-connected';
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

export const sendDemoEvent = (
  event: DemoSyncEvent,
) => {
  const channel =
    new BroadcastChannel(CHANNEL_NAME);

  channel.postMessage(event);

  channel.close();
};

export const subscribeToDemoEvents = (
  listener: DemoSyncListener,
) => {
  const channel =
    new BroadcastChannel(CHANNEL_NAME);

  const handleMessage = (
    event: MessageEvent<DemoSyncEvent>,
  ) => {
    listener(event.data);
  };

  channel.addEventListener(
    'message',
    handleMessage,
  );

  return () => {
    channel.removeEventListener(
      'message',
      handleMessage,
    );

    channel.close();
  };
};