import { ApiResponse, HTTP_STATUS } from './ApiResponse';

export class NoContentResponse extends ApiResponse<null> {
  constructor() {
    super(HTTP_STATUS.noContent);
  }
}
