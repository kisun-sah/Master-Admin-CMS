import { User } from '../models/User.js';
import { Role } from '../models/Role.js';

export async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication session expired or not provided. Please sign in.',
      },
    });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.status !== 'active') {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is inactive or has been suspended.',
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Failed to verify session authentication.',
      },
    });
  }
}

export function requirePermission(permission) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    // Super Admin has all permissions unconditionally
    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
      return next();
    }

    try {
      const role = await Role.findOne({ key: req.user.role });
      if (!role) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `Role "${req.user.role}" does not exist.`,
          },
        });
      }

      if (role.permissions.includes(permission) || role.permissions.includes('*')) {
        return next();
      }

      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. Required: ${permission}`,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: { code: 'RBAC_ERROR', message: 'Error checking role permissions.' },
      });
    }
  };
}
