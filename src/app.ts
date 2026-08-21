import 'dotenv/config';

import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import BookmarkRouter from './bookmarks/bookmarks.routes.js';
import { NotFoundError } from './errors/not-found-error.js';
import AuthMiddleware from './middleware/auth.js';
import { errorHandler } from './middleware/error-handler.js';
import UserRouter from './users/user.routes.js';

const app = express(); // Создание приложения

const PORT = Number(process.env.PORT) || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const MONGO_USER = process.env.MONGO_USER || 'master';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'master123';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGODB_PORT || '27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'bookmark';

const MONGO_URI =
  process.env.MONGO_URI ??
  `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;

app.use(
  helmet({
    contentSecurityPolicy: false,
    xPoweredBy: false,
  }),
);
app.disable('x-powered-by');
app.use(
  cors({
    origin: CORS_ORIGIN as string,
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

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error, retrying in 5 seconds...', error);
    setTimeout(connectWithRetry, 5000);
  }
};

const run = async () => {
  try {
    await connectWithRetry();
    const server = app.listen(Number(PORT), '0.0.0.0');

    server.on('listening', () => {
      console.log('Server listening:', server.address());
    });
  } catch (error) {
    console.error(error);
  }
};

run();
