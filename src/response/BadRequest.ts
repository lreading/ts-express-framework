import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class BadRequestResponse extends ApiResponse<string> {
  constructor(errorMessage?: string) {
    super(HTTP_STATUS.badRequest, errorMessage || 'Bad Request');
  }
}
