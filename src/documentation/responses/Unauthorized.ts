import { OpenAPIV3 } from 'openapi-types';

export const UnauthorizedRequestResponse: OpenAPIV3.ResponseObject = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      example: {
        status: 401,
        body: 'Unauthorized'
      }
    }
  }
};
