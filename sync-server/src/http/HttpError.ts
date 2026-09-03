/**
 * Erreur HTTP transportant explicitement le code de statut à retourner au client.
 */
class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export default HttpError;
