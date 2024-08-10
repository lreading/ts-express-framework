import { Request, Response } from 'express';

import { BodyDefinition } from './BodyDefinition';
import { METHOD } from './Method';
import { ParamDefinition } from './ParamDefinition';

type ExpressResponseHandler = (req: Request, res: Response, instance: any) => any;

export interface RouteDefinition {
  path: string;
  method: METHOD;
  implementation: ExpressResponseHandler;
  allowAnonymous: boolean;
  summary?: string;
  description?: string;
  exampleResponse?: any;
  bodyDefinition?: BodyDefinition;
  params?: ParamDefinition[];
  fullPath?: string;
  prefix?: string;
  allowedRoles?: string[];
}
