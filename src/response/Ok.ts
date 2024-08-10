import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class OkResponse<T> extends ApiResponse<T> {
  constructor(body: T) {
    super(HTTP_STATUS.ok, body);
  }
}
