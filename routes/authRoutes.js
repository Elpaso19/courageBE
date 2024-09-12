const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup and login routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;