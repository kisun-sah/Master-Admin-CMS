import { JobVacancy } from '../models/JobVacancy.js';
import { JobApplication } from '../models/JobApplication.js';
import { recordAudit } from '../services/auditService.js';
import mongoose from 'mongoose';

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function listVacancies(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.department && req.query.department !== 'all') {
      filter.department = req.query.department;
    }
    if (req.query.employmentType && req.query.employmentType !== 'all') {
      filter.employmentType = req.query.employmentType;
    }
    if (req.query.workMode && req.query.workMode !== 'all') {
      filter.workMode = req.query.workMode;
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search.trim(), $options: 'i' };
      filter.$or = [{ title: searchRegex }, { slug: searchRegex }, { department: searchRegex }];
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [total, vacancies] = await Promise.all([
      JobVacancy.countDocuments(filter),
      JobVacancy.find(filter)
        .populate('createdBy', 'displayName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: vacancies,
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

export async function getVacancy(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid vacancy ID format' },
      });
    }

    const vacancy = await JobVacancy.findOne({ _id: req.params.id, isDeleted: false })
      .populate('createdBy', 'displayName email')
      .populate('updatedBy', 'displayName email');

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
    }

    res.status(200).json({ success: true, data: vacancy });
  } catch (error) {
    next(error);
  }
}

export async function createVacancy(req, res, next) {
  try {
    const {
      title,
      slug,
      department,
      employmentType,
      location,
      workMode,
      openings,
      experience,
      education,
      salaryRange,
      shortDescription,
      description,
      responsibilities,
      requirements,
      deadline,
      featuredImage,
      status,
      seo,
    } = req.body;

    if (!title || !shortDescription || !description) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Job title, short description, and full description are required.',
        },
      });
    }

    const normalizedSlug = slug ? generateSlug(slug) : generateSlug(title);
    if (!normalizedSlug) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'A valid slug is required.' },
      });
    }

    const existingSlug = await JobVacancy.findOne({ slug: normalizedSlug, isDeleted: false });
    if (existingSlug) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: `The slug '${normalizedSlug}' is already in use by another vacancy.`,
        },
      });
    }

    const vacancy = await JobVacancy.create({
      title: title.trim(),
      slug: normalizedSlug,
      department: department || 'General',
      employmentType: employmentType || 'full-time',
      location: location || 'Headquarters',
      workMode: workMode || 'on-site',
      openings: parseInt(openings, 10) || 1,
      experience: experience || '',
      education: education || '',
      salaryRange: salaryRange || '',
      shortDescription: shortDescription.trim(),
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
      deadline: deadline ? new Date(deadline) : null,
      featuredImage: featuredImage || '',
      status: status || 'published',
      seo: seo || {},
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });

    await recordAudit(req, {
      action: 'careers.create',
      resourceType: 'JobVacancy',
      resourceId: vacancy._id,
      details: { title: vacancy.title, slug: vacancy.slug, status: vacancy.status },
    });

    res.status(201).json({ success: true, data: vacancy });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'Job vacancy with this slug already exists.' },
      });
    }
    next(error);
  }
}

export async function updateVacancy(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid vacancy ID' },
      });
    }

    const vacancy = await JobVacancy.findOne({ _id: req.params.id, isDeleted: false });
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.applicationCount; // Protect aggregated count
    delete updates.isDeleted;

    if (updates.slug && updates.slug !== vacancy.slug) {
      const normalizedSlug = generateSlug(updates.slug);
      const conflict = await JobVacancy.findOne({
        slug: normalizedSlug,
        _id: { $ne: vacancy._id },
        isDeleted: false,
      });
      if (conflict) {
        return res.status(409).json({
          success: false,
          error: { code: 'DUPLICATE_SLUG', message: `Slug '${normalizedSlug}' is already taken.` },
        });
      }
      updates.slug = normalizedSlug;
    }

    if (updates.responsibilities && typeof updates.responsibilities === 'string') {
      updates.responsibilities = updates.responsibilities.split('\n').filter(Boolean);
    }
    if (updates.requirements && typeof updates.requirements === 'string') {
      updates.requirements = updates.requirements.split('\n').filter(Boolean);
    }
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline);
    }

    updates.updatedBy = req.user?._id;
    Object.assign(vacancy, updates);
    await vacancy.save();

    await recordAudit(req, {
      action: 'careers.update',
      resourceType: 'JobVacancy',
      resourceId: vacancy._id,
      details: { title: vacancy.title, status: vacancy.status },
    });

    res.status(200).json({ success: true, data: vacancy });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_SLUG', message: 'Job vacancy slug already exists.' },
      });
    }
    next(error);
  }
}

export async function updateVacancyStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!['draft', 'published', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Status must be draft, published, or closed.' },
      });
    }

    const vacancy = await JobVacancy.findOne({ _id: req.params.id, isDeleted: false });
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
    }

    const oldStatus = vacancy.status;
    vacancy.status = status;
    vacancy.updatedBy = req.user?._id;
    await vacancy.save();

    await recordAudit(req, {
      action: 'careers.status_change',
      resourceType: 'JobVacancy',
      resourceId: vacancy._id,
      details: { from: oldStatus, to: status },
    });

    res.status(200).json({ success: true, data: vacancy });
  } catch (error) {
    next(error);
  }
}

export async function deleteVacancy(req, res, next) {
  try {
    const vacancy = await JobVacancy.findOne({ _id: req.params.id, isDeleted: false });
    if (!vacancy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found' },
      });
    }

    // Check if applications exist to protect historical applicant records
    const applicationsCount = await JobApplication.countDocuments({ vacancy: vacancy._id });
    if (applicationsCount > 0) {
      // Soft-delete to preserve foreign-key integrity and application history
      vacancy.isDeleted = true;
      vacancy.status = 'closed';
      vacancy.updatedBy = req.user?._id;
      await vacancy.save();

      await recordAudit(req, {
        action: 'careers.archive',
        resourceType: 'JobVacancy',
        resourceId: vacancy._id,
        details: { title: vacancy.title, preservedApplications: applicationsCount },
      });

      return res.status(200).json({
        success: true,
        data: {
          message: `Vacancy closed and archived. ${applicationsCount} applicant records preserved.`,
        },
      });
    }

    // If zero applications, safe hard deletion
    await JobVacancy.findByIdAndDelete(vacancy._id);

    await recordAudit(req, {
      action: 'careers.delete',
      resourceType: 'JobVacancy',
      resourceId: vacancy._id,
      details: { title: vacancy.title },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Vacancy permanently deleted.' },
    });
  } catch (error) {
    next(error);
  }
}

// ---------------- PUBLIC READ-ONLY APIS ----------------

export async function getPublicCareers(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const now = new Date();
    const filter = {
      status: 'published',
      isDeleted: false,
      $or: [{ deadline: null }, { deadline: { $gte: now } }],
    };

    if (req.query.department && req.query.department !== 'all') {
      filter.department = req.query.department;
    }
    if (req.query.employmentType && req.query.employmentType !== 'all') {
      filter.employmentType = req.query.employmentType;
    }
    if (req.query.workMode && req.query.workMode !== 'all') {
      filter.workMode = req.query.workMode;
    }
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search.trim(), $options: 'i' } },
        { department: { $regex: req.query.search.trim(), $options: 'i' } },
        { shortDescription: { $regex: req.query.search.trim(), $options: 'i' } },
      ];
    }

    const [total, vacancies] = await Promise.all([
      JobVacancy.countDocuments(filter),
      JobVacancy.find(filter)
        .select(
          'title slug department employmentType location workMode openings experience education salaryRange shortDescription deadline featuredImage seo createdAt'
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: vacancies,
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

export async function getPublicCareerBySlug(req, res, next) {
  try {
    const now = new Date();
    const vacancy = await JobVacancy.findOne({
      slug: req.params.slug,
      status: 'published',
      isDeleted: false,
      $or: [{ deadline: null }, { deadline: { $gte: now } }],
    }).select('-createdBy -updatedBy -isDeleted -applicationCount');

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Job vacancy not found or has closed.' },
      });
    }

    res.status(200).json({ success: true, data: vacancy });
  } catch (error) {
    next(error);
  }
}

