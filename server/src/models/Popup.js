import mongoose from 'mongoose';

const popupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    ctaText: {
      type: String,
      default: '',
    },
    ctaLink: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
      index: true,
    },
    frequency: {
      type: String,
      enum: ['always', 'once_per_session', 'once_per_day'],
      default: 'once_per_session',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Popup = mongoose.model('Popup', popupSchema);
