import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cafe',
      required: [true, 'cafeId is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 300,
    },
    order: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ cafeId: 1, order: 1 });

const Category = mongoose.model('Category', categorySchema);

export { Category };
