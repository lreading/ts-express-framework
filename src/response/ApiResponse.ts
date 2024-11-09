import { Response } from 'express';

export enum HTTP_STATUS {
  ok = 200,
  created = 201,
  accepted = 202,
  noContent = 204,

  temporaryRedirect = 302,

  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,

  serverError = 500
}

export abstract class ApiResponse<T> {
  private readonly _status: HTTP_STATUS;
  get status(): HTTP_STATUS {
    return this._status;
  }

  private readonly _body: T;
  get body(): T {
    return this._body;
  }

  constructor(status: HTTP_STATUS, body?: T) {
    this._status = status;
    this._body = body;
  }

  toResponse(res: Response): Response | void {
    const code: number = this._status;
    const data = this._body || undefined;
    return res.status(code).json(data);
  }
}
