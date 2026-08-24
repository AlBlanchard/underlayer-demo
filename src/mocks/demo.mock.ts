import type {
  DemoSession,
} from '@/types/demo';

const now = new Date().toISOString();

export const demoSessionMock: DemoSession = {
  id: 'demo-123',

  status: 'waiting-for-viewer',

  viewer: null,

  protectedImageUrl: null,

  uploadedImageUrl: null,

  identifiedViewer: null,

  createdAt: now,
  updatedAt: now,
};