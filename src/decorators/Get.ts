import { METHOD } from '../entity/Method';
import { RequestDecorator } from './Request';
import { RequestDecoratorOptions } from '../entity';

export const Get = (path: string, options: RequestDecoratorOptions): MethodDecorator => {
  return RequestDecorator(path, METHOD.GET, options);
};
