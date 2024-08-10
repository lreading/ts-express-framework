import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class RedirectError extends ApiError {
  public readonly readirectLocation: string;

  constructor(req: Request, redirectLocation: string) {
    super(req);
    this.readirectLocation = redirectLocation;
  }

  logMessage(logger: TSLogger): void {
    logger.audit(`Redirecting request to: ${this.readirectLocation}`);
  }
}
