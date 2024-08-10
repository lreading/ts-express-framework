import { OpenAPIV3 } from 'openapi-types';

export const NotFoundResponse: OpenAPIV3.ResponseObject = {
  description: 'Not Found',
  content: {
    'application/json': {
      example: {
        status: 404,
        body: 'Resource Not Found'
      }
    }
  }
};
