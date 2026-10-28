import mongoose from 'mongoose';

const redirectSchema = new mongoose.Schema(
  {
    sourcePath: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    destinationPath: {
      type: String,
      required: true,
      trim: true,
    },
    statusCode: {
      type: Number,
      enum: [301, 302],
      default: 301,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    hitCount: {
      type: Number,
      default: 0,
    },
    lastTriggeredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Redirect = mongoose.model('Redirect', redirectSchema);
