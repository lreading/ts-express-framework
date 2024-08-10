import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class AcceptedResponse<T> extends ApiResponse<T> {
  constructor(body: T) {
    super(HTTP_STATUS.accepted, body);
  }
}
