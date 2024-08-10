import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class UnauthorizedResponse extends ApiResponse<string> {
  constructor() {
    super(HTTP_STATUS.unauthorized, 'Unauthorized');
  }
}
