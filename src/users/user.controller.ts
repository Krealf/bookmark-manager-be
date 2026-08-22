import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ErrorCodes } from '../constants/error-codes.js';
import BadRequestError from '../errors/bad-request-error.js';
import Conflict from '../errors/conflict-error.js';
import NotAuthorizedError from '../errors/not-authorized-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { transformError } from '../helpers/transform-error.js';
import tokenModel from './token.model.js';
import UserModel, { User } from './user.model.js';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user: Pick<User, 'email' | 'password' | 'fullName' | 'avatarUrl'> =
    req.body;

  try {
    const newUser = await UserModel.create(user);
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    await tokenModel.saveToken(newUser._id, refreshToken);

    res
      .status(201)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      })
      .send({
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          avatarUrl: newUser.avatarUrl || '',
        },
        accessToken,
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
    const refreshToken = user.generateRefreshToken();
    await tokenModel.saveToken(user._id, refreshToken);

    res
      .status(201)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      })
      .send({
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl || '',
        },
        accessToken,
      });
  } catch (error) {
    next(error);
  }
};

export const logOutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.cookies;

  try {
    await tokenModel.deleteOne({
      refreshToken,
    });
  } catch (error) {
    return next(error);
  }

  res
    .clearCookie('refreshToken', {
      httpOnly: true,
    })
    .json();
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
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl || '',
        },
      });
    } else {
      return next(new NotFoundError('User not found'));
    }
  } catch (error) {
    return next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken: oldRefreshToken } = req.cookies; // Старый токен из куки, который отправил пользователь

  if (!oldRefreshToken) {
    return next(new NotAuthorizedError());
  }

  try {
    const user = await UserModel.findById(res.locals.user.id).orFail(
      () => new NotFoundError('User not found'),
    );

    await tokenModel.deleteOne({
      refreshToken: oldRefreshToken,
      userId: user._id,
    });

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    await tokenModel.saveToken(user._id, newRefreshToken);

    res
      .status(201)
      .cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      })
      .send({
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl || '',
        },
        accessToken: newAccessToken,
      });
  } catch (error) {
    return next(error);
  }
};
