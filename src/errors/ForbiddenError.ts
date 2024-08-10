import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class ForbiddenError extends ApiError {
  constructor(req: Request) {
    super(req);
  }

  logMessage(logger: TSLogger): void {
    logger.error(`Forbidden: ${this.getMessage()}`);
  }
}
