import { Express } from 'express';

import { ExpressMiddleware, TSController } from './';

export interface RegistrationParams {
  app: Express;
  controllers: TSController[];
  swaggerDocLocation?: string;
  authMiddleware: ExpressMiddleware | ExpressMiddleware[];
}
