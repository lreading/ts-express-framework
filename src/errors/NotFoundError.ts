import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class NotFoundError extends ApiError {
  constructor(req: Request) {
    super(req);
  }

  logMessage(logger: TSLogger): void {
    logger.error(`Not Found: ${this.getMessage()}`);
  }
}
