import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class UnauthorizedError extends ApiError {
  constructor(req: Request) {
    super(req);
  }

  logMessage(logger: TSLogger): void {
    logger.debug(`Unauthorized: ${this.getMessage()}`);
  }
}
