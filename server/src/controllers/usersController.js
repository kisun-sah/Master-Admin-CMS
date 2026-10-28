import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { recordAudit } from '../services/auditService.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { email, displayName, password, role, status } = req.body;

    if (!email || !displayName || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email, display name, and password are required.' },
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'CONFLICT', message: `User with email '${email}' already exists.` },
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      displayName: displayName.trim(),
      passwordHash,
      role: role || 'editor',
      status: status || 'active',
    });

    await recordAudit(req, {
      action: 'user.create',
      resourceType: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role },
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    const { displayName, role, status, password } = req.body;

    // Prevent demoting the last active superadmin
    if (user.role === 'superadmin' && role && role !== 'superadmin') {
      const superAdminCount = await User.countDocuments({ role: 'superadmin', status: 'active' });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: { code: 'CANNOT_DEMOTE', message: 'Cannot demote the only remaining active Super Admin.' },
        });
      }
    }

    if (displayName) user.displayName = displayName.trim();
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) {
      user.passwordHash = await User.hashPassword(password);
    }

    await user.save();

    await recordAudit(req, {
      action: 'user.update',
      resourceType: 'User',
      resourceId: user._id,
      details: { email: user.email, role: user.role, status: user.status },
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const targetId = req.params.id;

    // Prevent self-deletion
    if (req.user && req.user._id.toString() === targetId) {
      return res.status(400).json({
        success: false,
        error: { code: 'CANNOT_DELETE_SELF', message: 'You cannot delete your own active administrator account.' },
      });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found.' },
      });
    }

    // Prevent deleting last superadmin
    if (user.role === 'superadmin') {
      const superAdminCount = await User.countDocuments({ role: 'superadmin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: { code: 'CANNOT_DELETE', message: 'Cannot delete the only Super Admin account.' },
        });
      }
    }

    await User.findByIdAndDelete(targetId);

    await recordAudit(req, {
      action: 'user.delete',
      resourceType: 'User',
      resourceId: targetId,
      details: { email: user.email },
    });

    res.status(200).json({ success: true, data: { message: 'User account removed.' } });
  } catch (error) {
    next(error);
  }
}

export async function listRoles(req, res, next) {
  try {
    const roles = await Role.find().sort({ key: 1 });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
}

export async function updateRole(req, res, next) {
  try {
    const role = await Role.findOne({ key: req.params.key });
    if (!role) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Role not found.' },
      });
    }

    const { name, description, permissions } = req.body;
    if (name) role.name = name.trim();
    if (description !== undefined) role.description = description.trim();
    if (permissions && Array.isArray(permissions)) {
      role.permissions = permissions;
    }

    await role.save();

    await recordAudit(req, {
      action: 'role.update',
      resourceType: 'Role',
      resourceId: role._id,
      details: { roleKey: role.key, permissionsCount: role.permissions.length },
    });

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
}
