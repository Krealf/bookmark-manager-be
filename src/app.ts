import 'dotenv/config';

import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import BookmarkRouter from './bookmarks/bookmarks.routes';
import { NotFoundError } from './errors/not-found-error';
import AuthMiddleware from './middleware/auth';
import { errorHandler } from './middleware/error-handler';
import UserRouter from './users/user.routes';

const app = express(); // Создание приложения

const { PORT, MONGO_URL, FRONTEND_URL } = process.env;

app.use(
  helmet({
    contentSecurityPolicy: false,
    xPoweredBy: false,
  }),
);
app.disable('x-powered-by');
app.use(
  cors({
    origin: FRONTEND_URL as string,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(UserRouter);

app.use(AuthMiddleware);

app.use(BookmarkRouter);

app.use(errors());
app.use((request, res, next) => next(new NotFoundError('Not found')));
app.use(errorHandler);

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log('Server started on http://localhost:' + PORT);
      // console.log('Docs available at http://localhost:' + PORT + '/api-docs');
    });
  } catch (error) {
    console.error(error);
  }
};

run();
