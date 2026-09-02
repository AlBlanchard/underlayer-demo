import DemoSessionStore from '../sessions/DemoSessionStore.js';
import UploadService from './UploadService.js';

/**
 * Nettoie les captures temporaires qui ne sont plus utilisées par une session.
 */
class UploadCleaner {
  constructor(
    private readonly uploadService: UploadService,
    private readonly sessionStore: DemoSessionStore,
  ) {}

  /**
   * Supprime les anciens uploads au démarrage.
   * Les sessions étant stockées en mémoire, aucune capture précédente n'est encore valide.
   */
  async cleanOnStartup(): Promise<void> {
    try {
      await this.uploadService.clear();
    } catch (error) {
      console.error('Unable to clean uploads on startup.', error);
    }
  }

  /**
   * Supprime la capture actuellement associée à une session.
   */
  async cleanSession(sessionId: string): Promise<void> {
    const session = this.sessionStore.get(sessionId);

    if (!session?.uploadedImageUrl) {
      return;
    }

    await this.cleanImageUrl(session.uploadedImageUrl);
  }

  private async cleanImageUrl(imageUrl: string): Promise<void> {
    try {
      const filename = this.uploadService.getFilenameFromUrl(imageUrl);

      if (!filename) {
        return;
      }

      await this.uploadService.delete(filename);
    } catch (error) {
      console.error(`Unable to clean upload "${imageUrl}".`, error);
    }
  }
}

export default UploadCleaner;
