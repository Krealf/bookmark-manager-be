import { model, Schema, Types } from 'mongoose';

export interface Bookmark {
  title: string;
  description: string;
  websiteUrl: string;
  tags: string[];
  faviconUrl: string;
  pinned: boolean;
  isArchived: boolean;
  visitCount: number;
  owner: Types.ObjectId;
  visitedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookmarkSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    websiteUrl: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    faviconUrl: {
      type: String,
      default: '',
      trim: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    visitCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    visitedAt: {
      type: Date,
      default: Date.now(),
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_document, returnValue: Record<string, any>) => {
        delete returnValue._id;
        delete returnValue.__v;
        return returnValue;
      },
    },
  },
);

bookmarkSchema.methods.checkOwner = function (userId: Schema.Types.ObjectId) {
  return this.owner.toString() === userId;
};

const bookmarkModel = model<Bookmark>('bookmark', bookmarkSchema);

export default bookmarkModel;
