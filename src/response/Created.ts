import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class CreatedResponse<T> extends ApiResponse<T> {
  constructor(body: T) {
    super(HTTP_STATUS.created, body);
  }
}
