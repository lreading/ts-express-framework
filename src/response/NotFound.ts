import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class NotFoundResponse extends ApiResponse<string> {
  constructor() {
    super(HTTP_STATUS.notFound, 'Resource not found');
  }
}
