import { TeamMember } from '../models/TeamMember.js';
import { recordAudit } from '../services/auditService.js';

export async function listTeamMembers(req, res, next) {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    const team = await TeamMember.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
}

export async function createTeamMember(req, res, next) {
  try {
    const { name, designation, bio, portrait, socialLinks, order, status } = req.body;

    if (!name || !designation) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name and designation are required.' },
      });
    }

    const member = await TeamMember.create({
      name: name.trim(),
      designation: designation.trim(),
      bio: bio || '',
      portrait: portrait || '',
      socialLinks: socialLinks || {},
      order: Number(order) || 0,
      status: status || 'active',
    });

    await recordAudit(req, {
      action: 'team.create',
      resourceType: 'TeamMember',
      resourceId: member._id,
      details: { name: member.name },
    });

    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
}

export async function updateTeamMember(req, res, next) {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team member not found.' },
      });
    }

    const { name, designation, bio, portrait, socialLinks, order, status } = req.body;

    if (name) member.name = name.trim();
    if (designation) member.designation = designation.trim();
    if (bio !== undefined) member.bio = bio;
    if (portrait !== undefined) member.portrait = portrait;
    if (socialLinks !== undefined) member.socialLinks = socialLinks;
    if (order !== undefined) member.order = Number(order);
    if (status) member.status = status;

    await member.save();

    await recordAudit(req, {
      action: 'team.update',
      resourceType: 'TeamMember',
      resourceId: member._id,
      details: { name: member.name },
    });

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeamMember(req, res, next) {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team member not found.' },
      });
    }

    await recordAudit(req, {
      action: 'team.delete',
      resourceType: 'TeamMember',
      resourceId: req.params.id,
      details: { name: member.name },
    });

    res.status(200).json({ success: true, data: { message: 'Team member removed successfully.' } });
  } catch (error) {
    next(error);
  }
}
