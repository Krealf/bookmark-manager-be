import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError, Schema } from 'mongoose';

import BadRequestError from '../errors/bad-request-error';
import { transformError } from '../helpers/transform-error';
import bookmarkModel, { Bookmark } from './bookmark.model';
import BookmarkModel from './bookmark.model';

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

    res.status(201).send(newBookmark.toJSON());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);

      return next(new BadRequestError(errors[0].message));
    }

    next(error);
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
    return next(error);
  }
};
