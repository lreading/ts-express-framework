import { OpenAPIV3 } from 'openapi-types';

import { BadRequestResponse } from './BadRequest';
import { METHOD } from '../../entity';
import { NotFoundResponse } from './NotFound';
import { ServerErrorResponse } from './ServerError';
import { UnauthorizedRequestResponse } from './Unauthorized';

export const getResponses = (successResponse: OpenAPIV3.ResponseObject, method: METHOD): OpenAPIV3.ResponsesObject => {
  switch (method) {
  case METHOD.GET:
    return {
      200: successResponse,
      401: UnauthorizedRequestResponse,
      404: NotFoundResponse,
      500: ServerErrorResponse
    };
  case METHOD.POST:
    return {
      201: successResponse,
      400: BadRequestResponse,
      401: UnauthorizedRequestResponse,
      500: ServerErrorResponse
    };
  case METHOD.PUT:
    return {
      202: successResponse,
      400: BadRequestResponse,
      401: UnauthorizedRequestResponse,
      404: NotFoundResponse,
      500: ServerErrorResponse
    };
  case METHOD.DELETE:
    return {
      200: successResponse,
      401: UnauthorizedRequestResponse,
      404: NotFoundResponse,
      500: ServerErrorResponse
    };
  default:
    throw new Error(`Unknown method: ${method}`);
  }
};
