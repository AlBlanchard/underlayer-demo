import { createReadStream, createWriteStream, type ReadStream } from 'node:fs';
import { mkdir, readdir, stat, unlink } from 'node:fs/promises';
import type { IncomingMessage } from 'node:http';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

import HttpError from '../http/HttpError.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const UPLOAD_TTL = 60 * 60 * 1000;

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

interface UploadedFile {
  filepath: string;
  contentType: string;
}

/**
 * Gère le stockage temporaire, la lecture et la suppression des captures envoyées par les utilisateurs.
 */
class UploadService {
  constructor(private readonly uploadDirectory: string) {}

  async initialize(): Promise<void> {
    await mkdir(this.uploadDirectory, { recursive: true });
  }

  /**
   * Enregistre une image reçue depuis une requête HTTP et retourne son nom de fichier.
   */
  async store(request: IncomingMessage): Promise<string> {
    const contentType = request.headers['content-type'];
    const extension = contentType ? ALLOWED_TYPES[contentType] : undefined;

    if (!extension) {
      throw new HttpError(415, 'Unsupported image type.');
    }

    const contentLength = Number(request.headers['content-length'] ?? 0);

    if (contentLength > MAX_FILE_SIZE) {
      throw new HttpError(413, 'Image exceeds maximum size.');
    }

    const filename = `${randomUUID()}${extension}`;
    const filepath = join(this.uploadDirectory, filename);

    await this.writeFile(request, filepath);
    this.scheduleDeletion(filepath);

    return filename;
  }

  async getFile(filename: string): Promise<UploadedFile> {
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');

    if (safeFilename !== filename) {
      throw new HttpError(400, 'Invalid filename.');
    }

    const filepath = join(this.uploadDirectory, safeFilename);

    try {
      await stat(filepath);
    } catch {
      throw new HttpError(404, 'Image not found.');
    }

    const contentType = this.getContentType(safeFilename);

    if (!contentType) {
      throw new HttpError(415, 'Unsupported image type.');
    }

    return {
      filepath,
      contentType,
    };
  }

  createReadStream(filepath: string): ReadStream {
    return createReadStream(filepath);
  }

  async delete(filename: string): Promise<void> {
    const filepath = join(this.uploadDirectory, filename);

    try {
      await unlink(filepath);
    } catch (error) {
      if (this.isNodeError(error) && error.code === 'ENOENT') {
        return;
      }

      throw error;
    }
  }

  async clear(): Promise<void> {
    const files = await readdir(this.uploadDirectory);

    await Promise.all(files.map((filename) => this.delete(filename)));
  }

  getFilenameFromUrl(imageUrl: string): string | null {
    try {
      const url = new URL(imageUrl);

      if (!url.pathname.startsWith('/uploads/')) {
        return null;
      }

      return url.pathname.slice('/uploads/'.length) || null;
    } catch {
      return null;
    }
  }

  private writeFile(request: IncomingMessage, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileStream = createWriteStream(filepath);
      let receivedBytes = 0;
      let aborted = false;

      request.on('data', (chunk: Buffer) => {
        receivedBytes += chunk.length;

        // Le Content-Length n'est pas toujours fiable : on contrôle aussi les octets réellement reçus.
        if (receivedBytes > MAX_FILE_SIZE) {
          aborted = true;
          request.destroy();
          fileStream.destroy();

          void unlink(filepath).catch(() => undefined);
          reject(new HttpError(413, 'Image exceeds maximum size.'));
        }
      });

      request.pipe(fileStream);

      fileStream.on('finish', () => {
        if (!aborted) {
          resolve();
        }
      });

      fileStream.on('error', () => {
        void unlink(filepath).catch(() => undefined);
        reject(new HttpError(500, 'Unable to store image.'));
      });
    });
  }

  private scheduleDeletion(filepath: string): void {
    const timeout = setTimeout(async () => {
      try {
        await unlink(filepath);
      } catch {
        // Le fichier peut déjà avoir été supprimé à la fermeture ou au redémarrage d'une session.
      }
    }, UPLOAD_TTL);

    timeout.unref();
  }

  private getContentType(filename: string): string | null {
    const extension = extname(filename).toLowerCase();

    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };

    return contentTypes[extension] ?? null;
  }

  private isNodeError(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error && 'code' in error;
  }
}

export default UploadService;
