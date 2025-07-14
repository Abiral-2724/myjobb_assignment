import mongoose, { Document, Model, Schema } from 'mongoose';

interface Otp {
  code: string;
  expiresAt: Date;
  sentAt:Date ;
}

export interface IUser extends Document {
  email: string;
  isVerified: boolean;
  otp: Otp;
  createdAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
    sentAt: {type : Date}
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
