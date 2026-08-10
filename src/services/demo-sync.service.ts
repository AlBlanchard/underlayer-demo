import type { Viewer } from '../types/demo';

const CHANNEL_NAME = 'underlayer-demo';

export type DemoSyncEvent =
  | {
      type: 'viewer-connected';
      sessionId: string;
      viewer: Viewer;
    };

export const createDemoChannel = () => {
  return new BroadcastChannel(CHANNEL_NAME);
};