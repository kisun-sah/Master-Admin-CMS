import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      index: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'document', 'other'],
      default: 'image',
      index: true,
    },
    size: {
      type: Number,
      required: true,
    },
    dimensions: {
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    uploaderEmail: {
      type: String,
      default: '',
    },
    referencesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
