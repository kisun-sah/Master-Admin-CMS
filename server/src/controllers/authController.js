import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { recordAudit } from '../services/auditService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      await recordAudit(req, {
        action: 'auth.login_failed',
        resourceType: 'User',
        details: { email, reason: 'User not found' },
        status: 'failure',
      });
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_DISABLED', message: 'Account is disabled. Contact system administrator.' },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await recordAudit(req, {
        action: 'auth.login_failed',
        resourceType: 'User',
        resourceId: user._id,
        details: { email, reason: 'Password mismatch' },
        status: 'failure',
      });
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      });
    }

    // Regenerate session to prevent fixation
    req.session.regenerate(async (err) => {
      if (err) return next(err);

      req.session.userId = user._id;
      user.lastLoginAt = new Date();
      await user.save();

      req.user = user;
      await recordAudit(req, {
        action: 'auth.login',
        resourceType: 'User',
        resourceId: user._id,
        details: { email: user.email },
        status: 'success',
      });

      // Fetch user role permissions
      let permissions = [];
      if (user.role === 'superadmin' || user.role === 'admin') {
        permissions = ['*'];
      } else {
        const role = await Role.findOne({ key: user.role });
        if (role) permissions = role.permissions;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            avatar: user.avatar,
            lastLoginAt: user.lastLoginAt,
            permissions,
          },
        },
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const userId = req.session?.userId;
    if (userId) {
      await recordAudit(req, {
        action: 'auth.logout',
        resourceType: 'User',
        resourceId: userId,
        status: 'success',
      });
    }

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie(process.env.COOKIE_NAME || 'master_cms_session', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      });
      return res.status(200).json({
        success: true,
        data: { message: 'Signed out successfully.' },
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = req.user;
    let permissions = [];
    if (user.role === 'superadmin' || user.role === 'admin') {
      permissions = ['*'];
    } else {
      const role = await Role.findOne({ key: user.role });
      if (role) permissions = role.permissions;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          avatar: user.avatar,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          permissions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { displayName, avatar } = req.body;
    const user = req.user;

    if (displayName) user.displayName = displayName.trim();
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    await recordAudit(req, {
      action: 'auth.profile_update',
      resourceType: 'User',
      resourceId: user._id,
      details: { displayName: user.displayName },
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Current and new password are required.' },
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'New password must be at least 8 characters long.' },
      });
    }

    const user = await User.findById(req.user._id).select('+passwordHash');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Current password does not match.' },
      });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    await recordAudit(req, {
      action: 'auth.password_change',
      resourceType: 'User',
      resourceId: user._id,
    });

    res.status(200).json({
      success: true,
      data: { message: 'Password changed successfully.' },
    });
  } catch (error) {
    next(error);
  }
}
