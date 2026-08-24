import type { DemoSession } from '@/types/demo';

export const demoSessionMock: DemoSession = {
  id: 'demo-123',
  status: 'waiting-for-viewer',
  viewer: null,
  protectedImageUrl: null,
  createdAt: new Date().toISOString(),
};