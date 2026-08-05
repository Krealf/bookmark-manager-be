import { Document, Model, model, Schema, Types } from 'mongoose';

export interface Token {
  userId: Types.ObjectId;
  refreshToken: string;
}

interface TokenDocument extends Document, Token {}

interface TokenModel extends Model<TokenDocument> {
  saveToken: (
    userId: Token['userId'],
    refreshToken: Token['refreshToken'],
  ) => Promise<TokenDocument | never>;
}

const tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tokenSchema.statics.saveToken = async function (
  userId: Token['userId'],
  refreshToken: Token['refreshToken'],
) {
  const tokenData = await tokenModel.findOne({ userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  return await tokenModel.create({ userId, refreshToken });
};

const tokenModel = model<Token, TokenModel>('token', tokenSchema);

export default tokenModel;
