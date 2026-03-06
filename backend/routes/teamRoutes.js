const express = require('express');
const router = express.Router();
const { createTeam, addMember, getTeams, getTeamMembers } = require('../controllers/teamController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('admin', 'teamleader'), createTeam);
router.post('/:teamId/members', protect, authorizeRoles('admin', 'teamleader'), addMember);
router.get('/', protect, getTeams);
router.get('/:teamId/members', protect, getTeamMembers);

module.exports = router;