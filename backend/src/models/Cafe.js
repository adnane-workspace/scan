import mongoose from 'mongoose';

const cafeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
      maxlength: 200,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: 30,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 80,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Cafe = mongoose.model('Cafe', cafeSchema);

export { Cafe };
