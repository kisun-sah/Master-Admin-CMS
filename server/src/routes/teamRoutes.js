import express from 'express';
import {
  listTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('team:read'), listTeamMembers);
router.post('/', requireAuth, requirePermission('team:manage'), createTeamMember);
router.put('/:id', requireAuth, requirePermission('team:manage'), updateTeamMember);
router.delete('/:id', requireAuth, requirePermission('team:manage'), deleteTeamMember);

export default router;
