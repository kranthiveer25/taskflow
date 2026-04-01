const express = require('express');
const router = express.Router();
const { createTeam, addMember, getTeams, getTeamMembers, removeMember } = require('../controllers/teamController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('admin', 'teamleader'), createTeam);
router.post('/:teamId/members', protect, authorizeRoles('admin', 'teamleader'), addMember);
router.get('/', protect, getTeams);
router.get('/:teamId/members', protect, getTeamMembers);
router.delete('/:teamId/members/:memberId', protect, authorizeRoles('admin', 'teamleader'), removeMember);

module.exports = router;