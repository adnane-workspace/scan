import mongoose from 'mongoose';

export const USER_ROLES = ['admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'passwordHash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'admin',
    },
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

userSchema.set('toObject', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

export { User };
