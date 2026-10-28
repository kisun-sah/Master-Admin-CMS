import { JobApplication } from '../models/JobApplication.js';
import { JobVacancy } from '../models/JobVacancy.js';
import { recordAudit } from '../services/auditService.js';
import { cleanupFile, privateUploadDir } from '../middleware/privateUpload.js';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';

function generateApplicationRef() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `APP-${dateStr}-${randomPart}`;
}

export async function submitApplication(req, res, next) {
  let uploadedFilePath = null;
  if (req.file) {
    uploadedFilePath = req.file.path;
  }

  try {
    const { slug } = req.params;
    const {
      name,
      email,
      phone,
      education,
      currentOrganization,
      experienceYears,
      portfolioUrl,
      linkedinUrl,
      coverLetter,
      privacyConsent,
    } = req.body;

    // 1. Verify Vacancy is open
    const now = new Date();
    const vacancy = await JobVacancy.findOne({
      slug,
      status: 'published',
      isDeleted: false,
      $or: [{ deadline: null }, { deadline: { $gte: now } }],
    });

    if (!vacancy) {
      if (uploadedFilePath) cleanupFile(uploadedFilePath);
      return res.status(404).json({
        success: false,
        error: {
          code: 'VACANCY_CLOSED',
          message: 'The requested job vacancy is not currently open for applications.',
        },
      });
    }

    // 2. Validate Required Applicant Fields
    if (!name || !email || !phone || !education) {
      if (uploadedFilePath) cleanupFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name, email address, phone number, and education are required.',
        },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      if (uploadedFilePath) cleanupFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_EMAIL', message: 'Please provide a valid email address.' },
      });
    }

    // 3. Privacy Consent Check
    const consentGiven = privacyConsent === true || privacyConsent === 'true' || privacyConsent === '1';
    if (!consentGiven) {
      if (uploadedFilePath) cleanupFile(uploadedFilePath);
      return res.status(400).json({
        success: false,
        error: {
          code: 'CONSENT_REQUIRED',
          message: 'You must consent to the privacy policy and application data processing.',
        },
      });
    }

    // 4. Validate CV document upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_REQUIRED', message: 'A CV / Resume document (PDF, DOC, DOCX) is required.' },
      });
    }

    // 5. Duplicate Submission Guard (same candidate email for the same vacancy in past 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingSubmission = await JobApplication.findOne({
      vacancy: vacancy._id,
      'candidate.email': email.trim().toLowerCase(),
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (existingSubmission) {
      if (uploadedFilePath) cleanupFile(uploadedFilePath);
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_APPLICATION',
          message: `You have already submitted an application for this vacancy within the last 24 hours (Ref: ${existingSubmission.applicationRef}).`,
        },
      });
    }

    // 6. Generate Unique Reference Number & Create Record
    let applicationRef = generateApplicationRef();
    let collisionCheck = await JobApplication.findOne({ applicationRef });
    while (collisionCheck) {
      applicationRef = generateApplicationRef();
      collisionCheck = await JobApplication.findOne({ applicationRef });
    }

    const application = await JobApplication.create({
      applicationRef,
      vacancy: vacancy._id,
      vacancyTitle: vacancy.title,
      candidate: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        education: education.trim(),
        currentOrganization: currentOrganization ? currentOrganization.trim() : '',
        experienceYears: experienceYears ? experienceYears.trim() : '',
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : '',
        linkedinUrl: linkedinUrl ? linkedinUrl.trim() : '',
      },
      coverLetter: coverLetter ? coverLetter.trim() : '',
      resume: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        storagePath: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      status: 'new',
      statusHistory: [
        {
          status: 'new',
          changedByName: 'Candidate Submission',
          changedAt: new Date(),
          note: 'Application successfully received from public portal.',
        },
      ],
      privacyConsent: {
        accepted: true,
        consentTimestamp: new Date(),
      },
      ipAddress: req.ip || '',
    });

    // Increment vacancy application count
    await JobVacancy.findByIdAndUpdate(vacancy._id, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      data: {
        applicationRef: application.applicationRef,
        vacancyTitle: vacancy.title,
        candidateName: application.candidate.name,
        message: 'Your application has been received successfully! Keep your reference number for inquiries.',
      },
    });
  } catch (error) {
    if (uploadedFilePath) cleanupFile(uploadedFilePath);
    next(error);
  }
}

export async function listApplications(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.vacancy && req.query.vacancy !== 'all') {
      if (mongoose.Types.ObjectId.isValid(req.query.vacancy)) {
        filter.vacancy = req.query.vacancy;
      }
    }

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.education && req.query.education !== 'all') {
      filter['candidate.education'] = { $regex: req.query.education.trim(), $options: 'i' };
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      filter.$or = [
        { applicationRef: searchRegex },
        { 'candidate.name': searchRegex },
        { 'candidate.email': searchRegex },
        { 'candidate.phone': searchRegex },
        { vacancyTitle: searchRegex },
      ];
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [total, applications] = await Promise.all([
      JobApplication.countDocuments(filter),
      JobApplication.find(filter)
        .select('-resume.storagePath -ipAddress')
        .populate('vacancy', 'title department status employmentType')
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getApplication(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid application ID format' },
      });
    }

    const application = await JobApplication.findById(req.params.id)
      .populate('vacancy', 'title slug department employmentType location workMode status deadline')
      .populate('notes.author', 'displayName email')
      .populate('statusHistory.changedBy', 'displayName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job application not found' },
      });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    const allowedStatuses = [
      'new',
      'under_review',
      'shortlisted',
      'interview',
      'selected',
      'rejected',
      'withdrawn',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: `Invalid status '${status}'.` },
      });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job application not found' },
      });
    }

    const oldStatus = application.status;
    application.status = status;
    application.statusHistory.push({
      status,
      changedBy: req.user?._id,
      changedByName: req.user?.displayName || 'Administrator',
      changedAt: new Date(),
      note: note || `Status changed from ${oldStatus} to ${status}`,
    });

    await application.save();

    await recordAudit(req, {
      action: 'jobapplications.status_change',
      resourceType: 'JobApplication',
      resourceId: application._id,
      details: {
        applicationRef: application.applicationRef,
        from: oldStatus,
        to: status,
        note: note || '',
      },
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

export async function addApplicationNote(req, res, next) {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Note text cannot be empty.' },
      });
    }

    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job application not found' },
      });
    }

    const newNote = {
      text: text.trim(),
      author: req.user?._id,
      authorName: req.user?.displayName || 'Recruiter',
      createdAt: new Date(),
    };

    application.notes.push(newNote);
    await application.save();

    await recordAudit(req, {
      action: 'jobapplications.add_note',
      resourceType: 'JobApplication',
      resourceId: application._id,
      details: { applicationRef: application.applicationRef },
    });

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
}

export async function downloadApplicationCv(req, res, next) {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.resume || !application.resume.filename) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Resume document record not found.' },
      });
    }

    const safeFilename = path.basename(application.resume.filename);
    const filePath = path.join(privateUploadDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: { code: 'FILE_NOT_FOUND', message: 'The stored CV document could not be located on the server.' },
      });
    }

    await recordAudit(req, {
      action: 'jobapplications.download_cv',
      resourceType: 'JobApplication',
      resourceId: application._id,
      details: {
        applicationRef: application.applicationRef,
        candidateName: application.candidate.name,
      },
    });

    res.download(filePath, application.resume.originalName);
  } catch (error) {
    next(error);
  }
}

export async function exportApplicationsCsv(req, res, next) {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });

    const headers = [
      'Application Ref',
      'Candidate Name',
      'Email',
      'Phone',
      'Position',
      'Education',
      'Current Org',
      'Experience',
      'Status',
      'Date Submitted',
    ];

    const rows = applications.map((a) => [
      a.applicationRef,
      `"${(a.candidate?.name || '').replace(/"/g, '""')}"`,
      `"${(a.candidate?.email || '').replace(/"/g, '""')}"`,
      `"${(a.candidate?.phone || '').replace(/"/g, '""')}"`,
      `"${(a.vacancyTitle || '').replace(/"/g, '""')}"`,
      `"${(a.candidate?.education || '').replace(/"/g, '""')}"`,
      `"${(a.candidate?.currentOrganization || '').replace(/"/g, '""')}"`,
      `"${(a.candidate?.experienceYears || '').replace(/"/g, '""')}"`,
      a.status,
      a.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    await recordAudit(req, {
      action: 'jobapplications.export_csv',
      resourceType: 'JobApplication',
      details: { exportedCount: applications.length },
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="job_applications.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}

export async function deleteApplication(req, res, next) {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job application not found' },
      });
    }

    // Clean up private stored CV file
    if (application.resume?.filename) {
      const safeFilename = path.basename(application.resume.filename);
      const filePath = path.join(privateUploadDir, safeFilename);
      cleanupFile(filePath);
    }

    await JobApplication.findByIdAndDelete(application._id);

    // Decrement vacancy count
    await JobVacancy.findByIdAndUpdate(application.vacancy, { $inc: { applicationCount: -1 } });

    await recordAudit(req, {
      action: 'jobapplications.delete',
      resourceType: 'JobApplication',
      resourceId: application._id,
      details: { applicationRef: application.applicationRef },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Application and associated document permanently deleted.' },
    });
  } catch (error) {
    next(error);
  }
}
