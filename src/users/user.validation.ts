import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as z from 'zod';
import { ZodType } from 'zod';

import NotAuthorizedError from '../errors/not-authorized-error.js';
import { isCustomPayload } from '../utils/type-guards.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

export const userSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .regex(emailRegex, 'Email is not valid'),
  password: z
    .string({ error: 'Password is required' })
    .min(6)
    .regex(
      passwordRegex,
      'The password must be at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
    ),
  fullName: z
    .string({ error: 'Full name is required' })
    .trim()
    .min(2, 'Full name is too short'),
  avatarUrl: z.string().trim().optional(),
});

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);

      return res.status(400).json({
        error: 'Validation error',
        details: fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
}

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return next(new NotAuthorizedError());

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    );

    if (!isCustomPayload(decoded)) return next(new NotAuthorizedError());

    res.locals.user = decoded;
    next();
  } catch {
    return next(new NotAuthorizedError());
  }
};
