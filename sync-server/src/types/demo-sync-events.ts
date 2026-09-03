import type { Viewer } from './viewer.ts';

interface DemoSyncEventBase {
  sessionId: string;
}

export interface ViewerConnectedEvent extends DemoSyncEventBase {
  type: 'viewer-connected';
  viewer: Viewer;
}

export interface EncodingStartedEvent extends DemoSyncEventBase {
  type: 'encoding-started';
  viewer: Viewer;
}

export interface ContentReadyEvent extends DemoSyncEventBase {
  type: 'content-ready';
  viewer: Viewer;
}

export interface CreatorPhaseEnteredEvent extends DemoSyncEventBase {
  type: 'creator-phase-entered';
  viewer: Viewer;
}

export interface ScreenshotUploadedEvent extends DemoSyncEventBase {
  type: 'screenshot-uploaded';
  viewer: Viewer;
  screenshotUrl: string;
}

export interface AnalysisStartedEvent extends DemoSyncEventBase {
  type: 'analysis-started';
  viewer: Viewer;
}

export interface ViewerIdentifiedEvent extends DemoSyncEventBase {
  type: 'viewer-identified';
  viewer: Viewer;
  identifiedViewer: Viewer;
}

export interface SessionRestartedEvent extends DemoSyncEventBase {
  type: 'session-restarted';
}

export interface SessionClosedEvent extends DemoSyncEventBase {
  type: 'session-closed';
}

export type DemoSyncEvent =
  | ViewerConnectedEvent
  | EncodingStartedEvent
  | ContentReadyEvent
  | CreatorPhaseEnteredEvent
  | ScreenshotUploadedEvent
  | AnalysisStartedEvent
  | ViewerIdentifiedEvent
  | SessionRestartedEvent
  | SessionClosedEvent;
