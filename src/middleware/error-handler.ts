import { NextFunction, Request, Response } from 'express';

import { CustomError } from '../errors/custom-error.js';

export const errorHandler = (
  error: Error,
  _: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json(error.serializeError());
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && {
      stack: error.stack,
    }),
  });
};
