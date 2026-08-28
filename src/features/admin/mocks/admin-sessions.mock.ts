import type { AdminSession } from '../types/admin-session';

const now = new Date().toISOString();

export const adminSessionsMock: AdminSession[] = [
  {
    id: 'a1b2c3d4-demo',
    status: 'identified',

    viewer: {
      id: 'viewer-1',
      username: 'Alexis',
    },

    protectedImageUrl: '/demo/protected-image.jpg',

    uploadedImageUrl: '/demo/protected-image.jpg',

    identifiedViewer: {
      id: 'viewer-1',
      username: 'Alexis',
    },

    screenshotPreviewUrl: '/demo/protected-image.jpg',

    createdAt: now,
    updatedAt: now,
  },

  {
    id: 'e5f6g7h8-demo',
    status: 'analysing',

    viewer: {
      id: 'viewer-2',
      username: 'Sarah',
    },

    protectedImageUrl: '/demo/protected-image.jpg',

    uploadedImageUrl: null,

    identifiedViewer: null,

    screenshotPreviewUrl: null,

    createdAt: now,
    updatedAt: now,
  },

  {
    id: 'i9j0k1l2-demo',
    status: 'content-ready',

    viewer: {
      id: 'viewer-3',
      username: 'Pierre',
    },

    protectedImageUrl: '/demo/protected-image.jpg',

    uploadedImageUrl: null,

    identifiedViewer: null,

    screenshotPreviewUrl: null,

    createdAt: now,
    updatedAt: now,
  },
];
