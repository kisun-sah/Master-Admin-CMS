import { FAQ } from '../models/FAQ.js';
import { recordAudit } from '../services/auditService.js';

export async function listFaqs(req, res, next) {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    const faqs = await FAQ.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
}

export async function createFaq(req, res, next) {
  try {
    const { question, answer, category, order, status } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Question and answer are required.' },
      });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category || 'General',
      order: Number(order) || 0,
      status: status || 'published',
    });

    await recordAudit(req, {
      action: 'faq.create',
      resourceType: 'FAQ',
      resourceId: faq._id,
      details: { question: faq.question },
    });

    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
}

export async function updateFaq(req, res, next) {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'FAQ not found.' },
      });
    }

    const { question, answer, category, order, status } = req.body;

    if (question) faq.question = question.trim();
    if (answer) faq.answer = answer.trim();
    if (category !== undefined) faq.category = category;
    if (order !== undefined) faq.order = Number(order);
    if (status) faq.status = status;

    await faq.save();

    await recordAudit(req, {
      action: 'faq.update',
      resourceType: 'FAQ',
      resourceId: faq._id,
      details: { question: faq.question },
    });

    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
}

export async function deleteFaq(req, res, next) {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'FAQ not found.' },
      });
    }

    await recordAudit(req, {
      action: 'faq.delete',
      resourceType: 'FAQ',
      resourceId: req.params.id,
      details: { question: faq.question },
    });

    res.status(200).json({ success: true, data: { message: 'FAQ deleted successfully.' } });
  } catch (error) {
    next(error);
  }
}
