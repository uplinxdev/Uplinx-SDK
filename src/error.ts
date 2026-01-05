/**
 * Custom error class for Uplinx SDK errors
 */
export class UplinxError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = 'UplinxError';
    this.status = status;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UplinxError);
    }
  }

  /**
   * Create an UplinxError from an API response
   */
  static fromResponse(status: number, body: unknown): UplinxError {
    if (typeof body === 'object' && body !== null && 'error' in body) {
      const errorBody = body as { error: string; code?: string; details?: unknown };
      return new UplinxError(
        errorBody.error,
        status,
        errorBody.code || 'UNKNOWN_ERROR',
        errorBody.details
      );
    }
    return new UplinxError('An unknown error occurred', status, 'UNKNOWN_ERROR', body);
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message.includes('fetch');
  }

  /**
   * Create a network error
   */
  static networkError(originalError: Error): UplinxError {
    return new UplinxError(
      `Network error: ${originalError.message}`,
      0,
      'NETWORK_ERROR',
      { originalError: originalError.message }
    );
  }

  /**
   * Create a timeout error
   */
  static timeoutError(): UplinxError {
    return new UplinxError('Request timed out', 408, 'TIMEOUT_ERROR');
  }

  /**
   * Serialize error to JSON
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }
}


