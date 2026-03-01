const express = require('express');
const router = express.Router();
const { login, me, register, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
router.post('/login', login);
router.post('/register', register);
router.get('/me', auth, me);
router.put('/me', auth, updateProfile);
module.exports = router;
