import { OpenAPIV3 } from 'openapi-types';

export const ServerErrorResponse: OpenAPIV3.ResponseObject = {
  description: 'ServerError',
  content: {
    'application/json': {
      example: {
        status: 500,
        body: 'Internal Server Error'
      }
    }
  }
};
