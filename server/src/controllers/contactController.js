import { ContactSubmission } from '../models/ContactSubmission.js';
import { recordAudit } from '../services/auditService.js';

export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, subject, message, sourcePage, honeypot } = req.body;

    // Honeypot spam protection
    if (honeypot) {
      return res.status(200).json({ success: true, data: { message: 'Inquiry received.' } });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name, email, and message are required fields.' },
      });
    }

    const submission = await ContactSubmission.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message: message.trim(),
      sourcePage: sourcePage || '/contact',
      status: 'new',
      ipAddress: req.ip || '',
    });

    res.status(201).json({
      success: true,
      data: { message: 'Thank you for reaching out! Your message has been received.' },
    });
  } catch (error) {
    next(error);
  }
}

export async function listSubmissions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 15));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { subject: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [total, submissions] = await Promise.all([
      ContactSubmission.countDocuments(filter),
      ContactSubmission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.status(200).json({
      success: true,
      data: submissions,
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

export async function updateSubmission(req, res, next) {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Contact submission not found.' },
      });
    }

    const { status, notes } = req.body;
    if (status) submission.status = status;
    if (notes !== undefined) submission.notes = notes;

    await submission.save();

    await recordAudit(req, {
      action: 'contact.update',
      resourceType: 'ContactSubmission',
      resourceId: submission._id,
      details: { status: submission.status },
    });

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
}

export async function deleteSubmission(req, res, next) {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Contact submission not found.' },
      });
    }

    await recordAudit(req, {
      action: 'contact.delete',
      resourceType: 'ContactSubmission',
      resourceId: req.params.id,
      details: { email: submission.email },
    });

    res.status(200).json({ success: true, data: { message: 'Submission deleted.' } });
  } catch (error) {
    next(error);
  }
}

export async function exportCsv(req, res, next) {
  try {
    const submissions = await ContactSubmission.find().sort({ createdAt: -1 });

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'];
    const rows = submissions.map((s) => [
      s._id,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.phone || '').replace(/"/g, '""')}"`,
      `"${(s.subject || '').replace(/"/g, '""')}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`,
      s.status,
      s.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="contact_submissions.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
}
