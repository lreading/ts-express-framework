import { OpenAPIV3 } from 'openapi-types';

export const BadRequestResponse: OpenAPIV3.ResponseObject = {
  description: 'Bad Request',
  content: {
    'application/json': {
      example: {
        status: 400,
        body: 'Property (xxx) is required'
      }
    }
  }
};
