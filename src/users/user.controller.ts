import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ErrorCodes } from '../constants/error-codes';
import BadRequestError from '../errors/bad-request-error';
import Conflict from '../errors/conflict-error';
import { NotFoundError } from '../errors/not-found-error';
import { transformError } from '../helpers/transform-error';
import UserModel, { User } from './user.model';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user: Pick<User, 'email' | 'password' | 'fullName' | 'avatarUrl'> =
    req.body;

  try {
    const newUser = await UserModel.create(user);
    const token = newUser.generateAccessToken();

    res
      .status(201)
      .cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      })
      .send({
        id: newUser._id,
      });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    if ((error as Error).message.startsWith(ErrorCodes.unique)) {
      return next(new Conflict('User with this email already exists!'));
    }

    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password }: Pick<User, 'email' | 'password'> = req.body;

  try {
    const user = await UserModel.findByCredentials(email, password);
    const accessToken = user.generateAccessToken();

    res
      .status(201)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      })
      .send({});
  } catch (error) {
    next(error);
  }
};

export const logOutUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res
    .clearCookie('accessToken', {
      httpOnly: true,
    })
    .json({});
};

export const getDataUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserModel.findById(res.locals.user.id);

    if (user) {
      res.send({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
      });
    } else {
      next(new NotFoundError('User not found'));
    }
  } catch (error) {
    next(error);
  }
};
