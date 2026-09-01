import type { IncomingMessage } from 'node:http';

/**
 * Fournit les helpers communs utilisés pour interpréter les requêtes HTTP.
 */
class HttpRequest {
  static getUrl(request: IncomingMessage): URL {
    return new URL(request.url ?? '/', `http://${request.headers.host}`);
  }

  static getPathParameter(pathname: string, prefix: string): string | null {
    if (!pathname.startsWith(prefix)) {
      return null;
    }

    const value = pathname.slice(prefix.length);

    return value || null;
  }
}

export default HttpRequest;
