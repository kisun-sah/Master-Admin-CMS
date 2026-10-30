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
    description: {
      type: String,
      default: '',
      trim: true,
    },
    hitCount: {
      type: Number,
      default: 0,
      index: true,
    },
    lastTriggeredAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

redirectSchema.index({ isActive: 1, sourcePath: 1 });
redirectSchema.index({ createdAt: -1 });

export const Redirect = mongoose.model('Redirect', redirectSchema);
