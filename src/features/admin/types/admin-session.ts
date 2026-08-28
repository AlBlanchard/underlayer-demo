import type { DemoSession } from '@/types/demo';

export interface AdminSession extends DemoSession {
  screenshotPreviewUrl: string | null;
}
