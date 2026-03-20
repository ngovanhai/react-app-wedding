const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { verifyJWT } = require('../utils/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', verifyJWT, getMe);
router.post('/logout', verifyJWT, logout);

module.exports = router;