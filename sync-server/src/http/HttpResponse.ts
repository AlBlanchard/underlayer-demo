import type { ReadStream } from 'node:fs';
import type { ServerResponse } from 'node:http';

import HttpError from './HttpError.js';

/**
 * Construit les réponses HTTP communes du serveur.
 */
class HttpResponse {
  constructor(private readonly frontendOrigin = '*') {}

  applyCors(response: ServerResponse): void {
    response.setHeader('Access-Control-Allow-Origin', this.frontendOrigin);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  json(response: ServerResponse, statusCode: number, data: unknown): void {
    this.applyCors(response);

    response.writeHead(statusCode, {
      'Content-Type': 'application/json',
    });

    response.end(JSON.stringify(data));
  }

  empty(response: ServerResponse, statusCode = 204): void {
    this.applyCors(response);
    response.writeHead(statusCode);
    response.end();
  }

  stream(response: ServerResponse, stream: ReadStream, contentType: string): void {
    this.applyCors(response);

    response.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    });

    stream.pipe(response);
  }

  /**
   * Transforme une erreur métier ou technique en réponse HTTP.
   */
  error(response: ServerResponse, error: unknown): void {
    if (error instanceof HttpError) {
      this.json(response, error.statusCode, {
        error: error.message,
      });

      return;
    }

    console.error(error);

    this.json(response, 500, {
      error: 'Internal server error.',
    });
  }
}

export default HttpResponse;
