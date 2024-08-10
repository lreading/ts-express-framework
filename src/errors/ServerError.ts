import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

import { ApiError } from './ApiError';

export class InternalServerError extends ApiError {
  constructor(req: Request) {
    super(req);
  }

  logMessage(logger: TSLogger): void {
    logger.error(`Internal Server Error: ${this.getMessage()}`);
  }
}
