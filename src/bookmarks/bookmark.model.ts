import { model, Schema } from 'mongoose';

export interface Bookmark {
  title: string;
  description: string;
  websiteUrl: string;
  tags: string[];
  faviconUrl: string;
  pinned: boolean;
  isArchived: boolean;
  visitCount: number;
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookmarkSchema.methods.checkOwner = function (userId: Schema.Types.ObjectId) {
  return this.owner.toString() === userId;
};

const bookmarkModel = model<Bookmark>('bookmark', bookmarkSchema);

export default bookmarkModel;
