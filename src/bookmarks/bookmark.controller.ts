import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError, Schema } from 'mongoose';

import BadRequestError from '../errors/bad-request-error.js';
import { NotFoundError } from '../errors/not-found-error.js';
import { transformError } from '../helpers/transform-error.js';
import bookmarkModel, { Bookmark } from './bookmark.model.js';
import BookmarkModel from './bookmark.model.js';

export const createBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const dto: Required<
    Pick<Bookmark, 'title' | 'description' | 'websiteUrl' | 'tags'>
  > = req.body;
  const ownerId: Schema.Types.ObjectId = res.locals.user.id;

  try {
    const newBookmark = await bookmarkModel.create({
      title: dto.title,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      tags: dto.tags,
      faviconUrl: 'https://a.favicon.im/' + new URL(dto.websiteUrl).hostname,
      pinned: false,
      isArchived: false,
      visitCount: 0,
      owner: ownerId,
    });

    res.status(201).send(newBookmark);
  } catch (error) {
    console.log(error);

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    return next(error);
  }
};

export const getAllBookmarks = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ownerId: Schema.Types.ObjectId = res.locals.user.id;

  try {
    const bookmarks = await BookmarkModel.find({ owner: ownerId });

    res.send(bookmarks);
  } catch (error) {
    console.log(error);

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    return next(error);
  }
};

export const updateBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bookmarkId = req.params.id;
  const ownerId: Schema.Types.ObjectId = res.locals.user.id;
  const updateData = req.body;

  try {
    const responseDocument = await BookmarkModel.findOneAndUpdate(
      {
        _id: bookmarkId,
        owner: ownerId,
      },
      { $set: updateData },
      { returnDocument: 'after' },
    );

    if (!responseDocument)
      return next(new NotFoundError('The bookmark was not found..'));

    res.status(200).send(responseDocument);
  } catch (error) {
    console.log(error);

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    return next(error);
  }
};

export const trackBookmarkVisit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bookmarkId = req.params.id;
  const ownerId: Schema.Types.ObjectId = res.locals.user.id;

  try {
    const responseDocument = await BookmarkModel.findOneAndUpdate(
      {
        _id: bookmarkId,
        owner: ownerId,
      },
      {
        $set: {
          visitedAt: Date.now(),
        },
        $inc: {
          visitCount: 1,
        },
      },
      { returnDocument: 'after' },
    );

    if (!responseDocument)
      return next(new NotFoundError('The bookmark was not found.'));

    res.status(200).send(responseDocument);
  } catch (error) {
    console.log(error);

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    return next(error);
  }
};

export const deleteBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bookmarkId = req.params.id;
  const ownerId: Schema.Types.ObjectId = res.locals.user.id;

  try {
    const responseDocument = await BookmarkModel.findOneAndDelete({
      _id: bookmarkId,
      owner: ownerId,
    });

    if (!responseDocument)
      return next(new NotFoundError('The bookmark was not found.'));

    res.status(204).send();
  } catch (error) {
    console.log(error);

    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    return next(error);
  }
};
