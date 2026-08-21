import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import NotAuthorizedError from '../errors/not-authorized-error.js';
import { isCustomPayload } from '../utils/type-guards.js';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(new NotAuthorizedError());
  }

  const tokenAccessSecret = process.env.JWT_ACCESS_SECRET as string;
  const accessToken = authorizationHeader.split(' ', 2)[1];

  if (!accessToken) {
    return next(new NotAuthorizedError());
  }

  try {
    const decodedAccessToken = jwt.verify(accessToken, tokenAccessSecret);

    if (!isCustomPayload(decodedAccessToken)) {
      return next(new NotAuthorizedError('Invalid token'));
    }
    res.locals.user = decodedAccessToken;
    return next();
  } catch {
    return next(new NotAuthorizedError());
  }
};

export default auth;
