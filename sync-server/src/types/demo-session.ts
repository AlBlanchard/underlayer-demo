import type { Viewer } from './viewer.ts';

export type DemoSessionStatus =
  | 'waiting-for-viewer'
  | 'viewer-connected'
  | 'encoding'
  | 'content-ready'
  | 'waiting-for-upload'
  | 'analysing'
  | 'identified'
  | 'error';

export interface DemoSession {
  id: string;
  status: DemoSessionStatus;

  viewer: Viewer | null;
  protectedImageUrl: string | null;
  uploadedImageUrl: string | null;
  identifiedViewer: Viewer | null;

  createdAt: string;
  updatedAt: string;
}
