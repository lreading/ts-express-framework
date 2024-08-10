import { getLogger } from '@lreading/ts-logger';
import { Express, Request, Response, NextFunction } from 'express';

import { ExpressMiddleware, RegistrationParams, RouteDefinition, TSController } from './entity';
import { getRbacMiddleware } from './middleware';
import { SwaggerJsonGenerator } from './documentation';

const logger = getLogger('init.ts');

export const registerControllers = ({
  app,
  controllers,
  swaggerDocLocation,
  authMiddleware
}: RegistrationParams): void => {
  const routes: RouteDefinition[] = [];
  controllers.forEach((controller) => routes.push(...registerController(app, controller, authMiddleware)));

  if (swaggerDocLocation) {
    const docs = new SwaggerJsonGenerator(routes);
    docs.generate(swaggerDocLocation);
  }
};

const getMiddleware = (
  middleware: ExpressMiddleware | ExpressMiddleware[],
  allowAnonymous: boolean,
  useRbac: boolean,
  allowedRoles: string[]
): ExpressMiddleware[] => {
  const middlewareArray = Array.isArray(middleware) ? middleware : [middleware];
  const passThrough = (_req: Request, _res: Response, next: NextFunction) => next();

  if (allowAnonymous) {
    return middlewareArray;
  }

  if (useRbac) {
    return [...middlewareArray, getRbacMiddleware(allowedRoles)];
  }

  return [passThrough, ...middlewareArray];
};

const registerController = (
  app: Express,
  controller: TSController,
  authMiddleware: ExpressMiddleware | ExpressMiddleware[]
): RouteDefinition[] => {
  const instance = new controller();
  const prefix = Reflect.getMetadata('prefix', controller);
  const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

  routes.forEach((route) => {
    const paramTypes = Reflect.getMetadata('design:paramtypes', controller);
    if (paramTypes && paramTypes.length > 0) {
      throw new Error(`The controller ${controller.name} must have a constructor that takes 0 arguments`);
    }

    route.prefix = prefix;
    const slash = route.prefix?.startsWith('/') ? '' : '/';
    route.fullPath = slash + route.prefix + route.path;
    logger.info(`Registered ${route.method.toUpperCase()} - ${route.fullPath}`);
    const useRbac = route.allowedRoles && route.allowedRoles.length > 0 && !route.allowAnonymous;
    const middleware = getMiddleware(authMiddleware, route.allowAnonymous, useRbac, route.allowedRoles);

    app[route.method](route.fullPath, middleware, (req: Request, res: Response) =>
      route.implementation(req, res, instance)
    );
  });

  return routes;
};
