import type { DemoSession } from '@/types/demo';

import type { AdminSession } from '../types/admin-session';

/**
 * Adapte une session serveur au format utilisé par l'interface Admin.
 */
export const toAdminSession = (session: DemoSession): AdminSession => ({
  ...session,
  screenshotPreviewUrl: session.uploadedImageUrl,
});
