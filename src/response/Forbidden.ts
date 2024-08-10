import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class ForbiddenResponse extends ApiResponse<string> {
  constructor() {
    super(HTTP_STATUS.forbidden, 'Forbidden');
  }
}
