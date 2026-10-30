import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    changedByName: {
      type: String,
      default: 'System',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    authorName: {
      type: String,
      default: 'Recruiter',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const jobApplicationSchema = new mongoose.Schema(
  {
    applicationRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    vacancy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobVacancy',
      required: [true, 'Vacancy reference is required'],
      index: true,
    },
    vacancyTitle: {
      type: String,
      default: '',
    },
    candidate: {
      name: {
        type: String,
        required: [true, 'Candidate name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Candidate email is required'],
        trim: true,
        lowercase: true,
        index: true,
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
      },
      education: {
        type: String,
        required: [true, 'Highest education is required'],
        trim: true,
      },
      currentOrganization: {
        type: String,
        default: '',
        trim: true,
      },
      experienceYears: {
        type: String,
        default: '',
        trim: true,
      },
      portfolioUrl: {
        type: String,
        default: '',
        trim: true,
      },
      linkedinUrl: {
        type: String,
        default: '',
        trim: true,
      },
    },
    coverLetter: {
      type: String,
      default: '',
      trim: true,
    },
    resume: {
      filename: {
        type: String,
        required: [true, 'Resume filename is required'],
      },
      originalName: {
        type: String,
        required: [true, 'Resume original name is required'],
      },
      storagePath: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['new', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected', 'withdrawn'],
      default: 'new',
      index: true,
    },
    notes: {
      type: [noteSchema],
      default: [],
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    privacyConsent: {
      accepted: {
        type: Boolean,
        required: [true, 'Privacy consent is required'],
      },
      consentTimestamp: {
        type: Date,
        default: Date.now,
      },
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound indexes
jobApplicationSchema.index({ vacancy: 1, status: 1, createdAt: -1 });
jobApplicationSchema.index({ 'candidate.email': 1, vacancy: 1 });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

