import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class NotFoundError extends ApiError {
  constructor(req: Request) {
    super(req);
  }

  logMessage(logger: TSLogger): void {
    logger.debug(`Not Found: ${this.getMessage()}`);
  }
}
