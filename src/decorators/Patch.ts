import { METHOD } from '../entity/Method';
import { RequestDecorator } from './Request';
import { RequestDecoratorOptions } from '../entity';

export const Patch = (path: string, options: RequestDecoratorOptions): MethodDecorator => {
  return RequestDecorator(path, METHOD.PATCH, options);
};

