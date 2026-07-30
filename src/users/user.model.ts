import { compare, genSalt, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Document, Model, model, Schema } from 'mongoose';

import NotAuthorizedError from '../errors/not-authorized-error';

export interface User {
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
  generateAccessToken: () => string;
}

interface UserDocument extends Document, User {}

interface UserModel extends Model<UserDocument> {
  findByCredentials: (
    email: User['email'],
    password: User['password'],
  ) => Promise<UserDocument | never>;
}

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name is too short'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          return emailRegex.test(value);
        },
        message: 'Email is not valid',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      validate: {
        validator: (value: string) => {
          const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

          return passwordRegex.test(value);
        },
        message:
          'The password must be at least 6 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
      },
      select: false,
    },
    avatarUrl: {
      type: String,
      default: undefined,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_document, returnValue) => {
        const { password: _password, ...rest } = returnValue;
        return rest;
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await genSalt(8);
      this.password = await hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d',
    },
  );
};

userSchema.statics.findByCredentials = async function (
  email: User['email'],
  password: User['password'],
) {
  const user = await this.findOne({ email })
    .select('+password')
    .orFail(
      () => new NotAuthorizedError('User with provided credentials not found!'),
    );

  const isCorrectPassword = await compare(password, user.password);

  if (isCorrectPassword) {
    return user;
  }

  throw new NotAuthorizedError('Invalid credentials!');
};

const userModel = model<User, UserModel>('user', userSchema);

export default userModel;
