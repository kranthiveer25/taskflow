const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateInput');

// Milestone 27: input validation applied before controller
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/users', protect, getAllUsers);

module.exports = router;