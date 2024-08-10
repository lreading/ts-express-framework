import { Response } from 'express';
import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class RedirectResponse extends ApiResponse<string> {
  constructor(redirectLocation: string) {
    super(HTTP_STATUS.temporaryRedirect, redirectLocation);
  }

  override toResponse(res: Response) {
    return res.redirect(this.body);
  }
}
