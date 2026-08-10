export type DemoStatus =
  | 'waiting-for-viewer'
  | 'viewer-connected'
  | 'encoding'
  | 'content-ready'
  | 'waiting-for-upload'
  | 'analysing'
  | 'identified'
  | 'error';

export interface Viewer {
  id: string;
  username: string;
}

export interface DemoSession {
  id: string;
  status: DemoStatus;
  viewer: Viewer | null;
  protectedImageUrl: string | null;
  createdAt: string;
}