import express from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  listRoles,
  updateRole,
} from '../controllers/usersController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('users:read'), listUsers);
router.post('/', requireAuth, requirePermission('users:manage'), createUser);
router.put('/:id', requireAuth, requirePermission('users:manage'), updateUser);
router.delete('/:id', requireAuth, requirePermission('users:manage'), deleteUser);

router.get('/roles/list', requireAuth, requirePermission('roles:manage'), listRoles);
router.put('/roles/:key', requireAuth, requirePermission('roles:manage'), updateRole);

export default router;
