import { Request, Response, NextFunction } from 'express';

import { forbidden } from '../response';

export const getRbacMiddleware = (roleNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roleNames || req.user.roleNames.length === 0) {
      return forbidden().toResponse(res);
    }
    if (!roleNames.some((roleName) => req.user.roleNames.includes(roleName))) {
      return forbidden().toResponse(res);
    }
    return next();
  };
};
