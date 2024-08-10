import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class BadRequestError extends ApiError {
  private readonly _errorMessage: string;
  get errorMessage(): string {
    return this._errorMessage;
  }

  constructor(req: Request, errorMessage?: string) {
    super(req);
    this._errorMessage = errorMessage || 'unknown';
  }

  logMessage(logger: TSLogger): void {
    logger.error(`Bad Request: ${this._errorMessage} ${this.getMessage()}`);
  }
}
