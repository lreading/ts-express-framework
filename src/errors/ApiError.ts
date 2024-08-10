import { Request } from 'express';
import { TSLogger } from '@lreading/ts-logger';

export abstract class ApiError extends Error {
  private readonly verb: string;
  private readonly path: string;
  private readonly userName: string;

  constructor(req: Request) {
    super('Api Error');
    this.verb = req.method;
    this.path = req.path;
    this.userName = req.user && req.user.email ? req.user.email : '';
  }

  abstract logMessage(logger: TSLogger): void;

  protected getMessage(): string {
    return `${this.verb.toUpperCase()} ${this.path}: ${this.userName || '(unkown user)'}`;
  }
}
