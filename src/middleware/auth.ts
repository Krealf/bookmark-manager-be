import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import NotAuthorizedError from '../errors/not-authorized-error';
import { isCustomPayload } from '../utils/type-guards';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new NotAuthorizedError());
  }

  const tokenSecret = process.env.JWT_SECRET as string;

  try {
    const decoded = jwt.verify(accessToken, tokenSecret);

    if (isCustomPayload(decoded)) {
      res.locals.user = decoded;
    } else {
      next(new NotAuthorizedError('Invalid token'));
    }

    next();
  } catch {
    next(new NotAuthorizedError());
  }
};

export default auth;
