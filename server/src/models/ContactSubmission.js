import mongoose from 'mongoose';

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    sourcePage: {
      type: String,
      default: '/contact',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'replied', 'spam', 'archived'],
      default: 'new',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);
