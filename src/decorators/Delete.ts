import { METHOD } from '../entity/Method';
import { RequestDecorator } from './Request';
import { RequestDecoratorOptions } from '../entity';

export const Delete = (path: string, options: RequestDecoratorOptions): MethodDecorator => {
  return RequestDecorator(path, METHOD.DELETE, options);
};
