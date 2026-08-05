import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import NotAuthorizedError from '../errors/not-authorized-error';
import { isCustomPayload } from '../utils/type-guards';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new NotAuthorizedError());
  }

  const tokenAccessSecret = process.env.JWT_ACCESS_SECRET as string;

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
