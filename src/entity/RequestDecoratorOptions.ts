import { BodyDefinition, ParamDefinition } from '../entity';

export interface RequestDecoratorOptions {
  summary?: string;
  allowAnonymous?: boolean;
  description?: string;
  bodyDefinition?: BodyDefinition;
  exampleResponse?: any;
  params?: ParamDefinition[];
  allowedRoles?: string[];
}
