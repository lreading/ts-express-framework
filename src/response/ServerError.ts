import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class ServerErrorResponse extends ApiResponse<string> {
  constructor() {
    super(HTTP_STATUS.serverError, 'Internal Server Error');
  }
}
