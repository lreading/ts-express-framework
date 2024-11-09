import { getLogger } from '@lreading/ts-logger';
import { Request, Response } from 'express';

import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  RedirectError,
  UnauthorizedError
} from '../errors';
import { RequestDecoratorOptions, RouteDefinition } from '../entity';
import { METHOD } from '../entity/Method';
import response, { ApiResponse } from '../response';

const getErrorResponse = (err: ApiError, res: Response): Response | void => {
  if (err instanceof BadRequestError) {
    return response.badRequest((err as BadRequestError).errorMessage).toResponse(res);
  }
  if (err instanceof ForbiddenError) {
    return response.forbidden().toResponse(res);
  }
  if (err instanceof NotFoundError) {
    return response.notFound().toResponse(res);
  }
  if (err instanceof UnauthorizedError) {
    return response.unauthorized().toResponse(res);
  }
  if (err instanceof RedirectError) {
    const redirectLocation = (err as RedirectError).readirectLocation;
    return response.redirect(redirectLocation).toResponse(res);
  }
  return response.serverError().toResponse(res);
};

const getResponseWrapper = (verb: string, body: unknown): ApiResponse<unknown> => {
  if (body === null) {
    return response.notFound();
  }

  switch (verb.toLowerCase()) {
  case 'post':
    return response.created(body);
  case 'patch':
  case 'delete':
    return response.noContent();
  case 'put':
    return response.accepted(body);
  default:
    return response.ok(body);
  }
};

export const RequestDecorator = (path: string, method: METHOD, options: RequestDecoratorOptions): MethodDecorator => {
  const logger = getLogger('decorators/Request.ts');

  return function (target: unknown, propertyKey: string) {
    const implementation = async (req: Request, res: Response, instance: any) => {
      try {
        logger.warn('instance');
        logger.warn(Object.keys(instance));
        logger.warn(`propertyKey ${propertyKey}`);
        logger.warn(`target ${Object.keys(target)}`);
        logger.warn(typeof instance[propertyKey]);
        const original = await instance[propertyKey](req, res);
        return getResponseWrapper(req.method, original).toResponse(res);
      } catch (err) {
        if (err instanceof ApiError) {
          err.logMessage(logger);
          return getErrorResponse(err, res);
        } else {
          logger.error('Unhandled error:');
          logger.error(err);
          return response.serverError().toResponse(res);
        }
      }
    };

    if (!Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }

    if (!Reflect.hasMetadata('prefix', target.constructor)) {
      Reflect.defineMetadata('prefix', '', target.constructor);
    }

    const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

    routes.push({
      path,
      method,
      implementation,
      allowAnonymous: !!options.allowAnonymous,
      summary: options.summary,
      description: options.description,
      exampleResponse: options.exampleResponse,
      bodyDefinition: Object.assign({}, options.bodyDefinition),
      params: [].concat(options.params || []),
      allowedRoles: options.allowedRoles
    });

    Reflect.defineMetadata('routes', routes, target.constructor);
  };
};
